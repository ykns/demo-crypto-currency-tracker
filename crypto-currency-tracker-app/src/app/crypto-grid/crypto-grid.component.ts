import { Component, OnInit } from '@angular/core';

import { CryptoCurrencyApiService, SymbolCode, CryptoCurrency, CurrencyExchangeRate } from '../services/crypto-currency-api.service';
import { ImageCellComponent } from '../image-cell/image-cell.component';

@Component({
  selector: 'app-crypto-grid',
  templateUrl: './crypto-grid.component.html',
  styleUrls: ['./crypto-grid.component.scss']
})
export class CryptoGridComponent implements OnInit {
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

  // limit to 20 coins due to max length limit imposed by crypto-compare's API
  private readonly maxNumberOfCoins = 20;
  // TODO consider finding a suitable API to provide this
  public fiatCurrencySymbols: SymbolCode[] = ['EUR', 'GBP', 'USD'];

  public selectedFiatCurrencySymbol: SymbolCode;

  public cryptoCurrencies: CryptoCurrency[];
  public selectedCryptoCurrency: CryptoCurrency;
  private currencyExchangeRates: CurrencyExchangeRate[];
  private symbolToCoinInfosMap: Map<SymbolCode, CryptoCurrency>;

  public cryptoCurrenciesWithPrice: (CryptoCurrency & { price: number })[];

  public getRowNodeId(data) {
    return data.id;
  }

  constructor(private cryptoCurrencyApiService: CryptoCurrencyApiService) {
    this.selectedFiatCurrencySymbol = this.fiatCurrencySymbol[0];
    this.getTopCryptoCurrencies();
  }

  private getTopCryptoCurrencies() {
    this.cryptoCurrencyApiService.getTopCryptoCurrenciesBy24HourVolume(this.selectedFiatCurrencySymbol, this.maxNumberOfCoins).subscribe(cryptoCurrencies => {
      this.cryptoCurrencies = cryptoCurrencies;
      this.symbolToCoinInfosMap = new Map(this.cryptoCurrencies.map(_ => [_.symbol, _]));
    });
  }

  onClick() {
    this.getCryptoCurrenciesExchangeRates(this.fiatCurrencySymbol[0]);
  }

  getCryptoCurrenciesExchangeRates(compareToCurrencySymbol: SymbolCode): void {
    this.cryptoCurrencyApiService.getCryptoCurrenciesExchangeRates(compareToCurrencySymbol, this.cryptoCurrencies.map(_ => _.symbol))
      .subscribe(currencyExchangeRates => {
        this.currencyExchangeRates = currencyExchangeRates;
        this.cryptoCurrenciesWithPrice = this.currencyExchangeRates.map(_ => ({
          ...this.symbolToCoinInfosMap.get(_.symbol),
          price: 1 / (_.exchangeRate)
        }));
      });
  }

  ngOnInit(): void {
  }

}
