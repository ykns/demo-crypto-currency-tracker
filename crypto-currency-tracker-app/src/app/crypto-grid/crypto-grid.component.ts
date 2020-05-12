import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { CryptoCurrencyApiService, SymbolCode, CryptoCurrency } from '../services/crypto-currency-api.service';
import { ImageCellComponent } from '../image-cell/image-cell.component';
import { Subscription } from 'rxjs';
import { CryptoCurrencyWebSocketService } from '../services/crypto-currency-websocket.service';

@Component({
  selector: 'app-crypto-grid',
  templateUrl: './crypto-grid.component.html',
  styleUrls: ['./crypto-grid.component.scss']
})
export class CryptoGridComponent implements OnInit, OnDestroy {
  columnDefs = [
    {
      headerName: 'No.',
      width: 50,
      valueGetter: params => params.node.rowIndex + 1,
      cellClass: 'cell-left'
    },
    {
      headerName: '',
      width: 80,
      field: 'imageUrl',
      cellClass: 'cell-center',
      cellRendererFramework: ImageCellComponent,
    },
    { headerName: 'Symbol', field: 'symbol', cellClass: 'cell-left', width: 100, },
    { headerName: 'Name', field: 'fullName', cellClass: 'cell-left', width: 150 },
    { headerName: 'Price', headerClass: 'cell-right', field: 'price', cellClass: 'cell-right', valueFormatter: ({ value }) => value.toFixed(2), width: 100 },
  ];

  private gridOptions;

  private symbolToCryptoCurrencies: Map<SymbolCode, any>;
  // limit to 20 coins due to max length limit imposed by crypto-compare's API
  private readonly maxNumberOfCoins = 20;
  // TODO consider finding a suitable API to provide this
  public fiatCurrencySymbols: SymbolCode[] = ['EUR', 'GBP', 'USD'];

  public selectedFiatCurrencySymbol: SymbolCode;

  public selectedCryptoCurrency: CryptoCurrency;

  private existingPriceSubscription: Subscription;

  public getRowNodeId(data) {
    return data.id;
  }

  constructor(private cryptoCurrencyApiService: CryptoCurrencyApiService, private cryptoCurrencyWebSocketService: CryptoCurrencyWebSocketService) {
    this.selectedFiatCurrencySymbol = this.fiatCurrencySymbols[0];
    this.getTopCryptoCurrencies();
  }

  onGridReady(params) {
    this.gridOptions = params.api;
    this.setupPriceUpdatesForGridAndStart();
  }

  setupPriceUpdatesForGridAndStart() {
    if (this.existingPriceSubscription) {
      this.existingPriceSubscription.unsubscribe();
    }
    const cryptoCurrenciesWithInitialZeroPrice = [...this.symbolToCryptoCurrencies.values()].map(cryptoCurrency => ({ ...cryptoCurrency, price: 0 }));
    this.gridOptions.setRowData(cryptoCurrenciesWithInitialZeroPrice);
    this.existingPriceSubscription = this.cryptoCurrencyWebSocketService.priceUpdates$.subscribe(priceUpdate => {
      console.log(`priceUpdate: from ${priceUpdate.fromSymbol} to ${priceUpdate.toSymbol} price: ${priceUpdate.price}`);
      const cryptoCurrencyWithPriceUpdate = { ...this.symbolToCryptoCurrencies.get(priceUpdate.fromSymbol), price: priceUpdate.price };
      const rowNode = this.gridOptions.getRowNode(cryptoCurrencyWithPriceUpdate.id);
      rowNode.setDataValue('price', priceUpdate.price);
    });
    this.cryptoCurrencyWebSocketService.connect();
    this.cryptoCurrencyWebSocketService.configureListenersForPriceUpdates([...this.symbolToCryptoCurrencies.keys()], this.selectedFiatCurrencySymbol);
  }

  private getTopCryptoCurrencies() {
    this.cryptoCurrencyApiService.getTopCryptoCurrenciesBy24HourVolume(this.selectedFiatCurrencySymbol, this.maxNumberOfCoins).subscribe(cryptoCurrencies => {
      this.symbolToCryptoCurrencies = new Map(cryptoCurrencies.map(cryptoCurrency => [cryptoCurrency.symbol, { ...cryptoCurrency }]));
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.cryptoCurrencyWebSocketService.disconnect();
  }
}
