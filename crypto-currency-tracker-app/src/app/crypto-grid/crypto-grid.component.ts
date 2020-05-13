import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { CryptoCurrencyApiService, SymbolCode, CryptoCurrency } from '../services/crypto-currency-api.service';
import { ImageCellComponent } from '../image-cell/image-cell.component';
import { Subscription } from 'rxjs';
import { CryptoCurrencyWebSocketService } from '../services/crypto-currency-websocket.service';
import { SelectHeaderComponent } from '../select-header/select-header.component';

@Component({
  selector: 'app-crypto-grid',
  templateUrl: './crypto-grid.component.html',
  styleUrls: ['./crypto-grid.component.scss']
})
export class CryptoGridComponent implements OnDestroy {

  constructor(private cryptoCurrencyApiService: CryptoCurrencyApiService, private cryptoCurrencyWebSocketService: CryptoCurrencyWebSocketService) { }

  private gridOptions;

  private symbolToCryptoCurrencies: Map<SymbolCode, any>;
  // limit to 20 coins due to max length limit imposed by crypto-compare's API
  private readonly maxNumberOfCoins = 20;
  // TODO consider finding a suitable API to provide this
  public fiatCurrencySymbols: SymbolCode[] = ['EUR', 'GBP', 'USD'];

  public selectedCryptoCurrency: CryptoCurrency;

  private existingPriceSubscription: Subscription;

  columnDefs = [
    {
      headerName: 'No.',
      width: 70,
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
    {
      headerName: 'Price',
      headerClass: 'cell-right',
      headerComponentFramework: SelectHeaderComponent,
      headerComponentParams: { items: this.fiatCurrencySymbols, onSelectedItem: (selectedItem: SymbolCode) => this.setupPriceUpdatesForGridAndStart(selectedItem) },
      field: 'price',
      cellClass: 'cell-right',
      width: 180,
      valueFormatter: ({ value }) => value.toFixed(4),
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
  ];

  public getRowNodeId(data) {
    return data.id;
  }

  async onGridReady(params: { api: any; }) {
    this.gridOptions = params.api;
    await this.getTopCryptoCurrencies(this.fiatCurrencySymbols[0]);
    this.setupPriceUpdatesForGridAndStart(this.fiatCurrencySymbols[0]);
  }

  onSelectFiatCurrencySymbol(selectedFiatCurrencySymbol: SymbolCode) {
    this.setupPriceUpdatesForGridAndStart(selectedFiatCurrencySymbol);
  }

  setupPriceUpdatesForGridAndStart(selectedFiatCurrencySymbol: SymbolCode) {
    if (this.existingPriceSubscription) {
      this.existingPriceSubscription.unsubscribe();
    }

    const cryptoCurrenciesWithInitialZeroPrice = [...this.symbolToCryptoCurrencies.values()].map(cryptoCurrency => ({ ...cryptoCurrency, price: 0 }));
    this.gridOptions.setRowData(cryptoCurrenciesWithInitialZeroPrice);
    this.existingPriceSubscription = this.cryptoCurrencyWebSocketService.priceUpdates$.subscribe(priceUpdate => {
      const cryptoCurrencyWithPriceUpdate = { ...this.symbolToCryptoCurrencies.get(priceUpdate.fromSymbol), price: priceUpdate.price };
      const rowNode = this.gridOptions.getRowNode(cryptoCurrencyWithPriceUpdate.id);
      rowNode.setDataValue('price', priceUpdate.price);
    });
    this.cryptoCurrencyWebSocketService.connect();
    this.cryptoCurrencyWebSocketService.configureListenersForPriceUpdates([...this.symbolToCryptoCurrencies.keys()], selectedFiatCurrencySymbol);
  }

  private async getTopCryptoCurrencies(selectedFiatCurrencySymbol) {
    const cryptoCurrencies = await this.cryptoCurrencyApiService.getTopCryptoCurrenciesBy24HourVolume(selectedFiatCurrencySymbol, this.maxNumberOfCoins).toPromise();
    this.symbolToCryptoCurrencies = new Map(cryptoCurrencies.map(cryptoCurrency => [cryptoCurrency.symbol, { ...cryptoCurrency }]));
  }

  ngOnDestroy(): void {
    this.cryptoCurrencyWebSocketService.disconnect();
  }
}
