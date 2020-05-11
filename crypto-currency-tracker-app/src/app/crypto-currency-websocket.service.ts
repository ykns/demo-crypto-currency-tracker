import { Injectable, OnDestroy } from '@angular/core';
import { WebsocketWrapperService } from './websocket-wrapper.service';
import { CompareService } from './compare.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


export type SymbolCode = string;

interface Message {
  action: string;
  subs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CryptoCurrencyWebSocketService implements OnDestroy {

  private previousExchangeRates: { left: SymbolCode, right: SymbolCode }[];

  public priceUpdates$: Subject<{
    fromSymbol: SymbolCode,
    toSymbol: SymbolCode,
    price: number
  }> = new Subject();

  constructor(private webSocketService: WebsocketWrapperService, private compareService: CompareService) { }
  public connect() {
    const url = `${environment.cryptoCompareWebSocketUrl}?api_key=${environment.cryptoCompareApiKey}`;
    this.webSocketService.connect(url).subscribe(
      message => {
        switch (message.TYPE) {
          case '5' /* Aggregate Index (CCCAGG) */:
            if (message.PRICE) {
              this.priceUpdates$.next({
                fromSymbol: message.FROMSYMBOL,
                toSymbol: message.TOSYMBOL,
                price: message.PRICE
              });
            }
            break;
        }
      },
      err => { throw err; },
      () => console.log('CryptoCurrencyDataService - complete'),
    );
  }

  public disconnect() {
    this.webSocketService.disconnect();
  }

  public configureListenersForPriceUpdates(newCryptoCurrencies: SymbolCode[], newFiatCurrency: SymbolCode) {
    const newExchangeRates = newCryptoCurrencies.map(_ => ({ left: _, right: newFiatCurrency }));
    const differences = this.compareService.compare(this.previousExchangeRates, newExchangeRates);

    const subRemoveMessage = this.createSubRemove(differences.removed.map(_ => this.createSubscriptionChannel(_.left, _.right)));
    this.webSocketService.send(subRemoveMessage);

    const subAddMessage = this.createSubAdd(differences.added.map(_ => this.createSubscriptionChannel(_.left, _.right)));
    this.webSocketService.send(subAddMessage);

    this.previousExchangeRates = newExchangeRates;
  }

  // 5~CCCAGG~{base}~{quote}
  public createSubscriptionChannel(baseCurrencySymbol: SymbolCode, quoteCurrencySymbol: SymbolCode): string {
    return `5~CCCAGG~${baseCurrencySymbol}~${quoteCurrencySymbol}`;
  }

  private createMessage(action: string, channels: string[]): Message {
    return {
      action,
      subs: channels,
    };
  }

  private createSubAdd(channels: string[]) {
    return this.createMessage('SubAdd', channels);
  }

  private createSubRemove(channel: string[]): { action: string, subs: string[] } {
    return this.createMessage('SubRemove', channel);
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}


