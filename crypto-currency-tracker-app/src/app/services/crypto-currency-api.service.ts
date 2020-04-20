import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { pluck, map, tap } from 'rxjs/operators';
// Set the http options
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Apikey ${environment.cryptoCompareApiKey}`
  })
};

export interface Currency {
  symbol: SymbolCode;
}

export interface CurrencyExchangeRate extends Currency {
  exchangeRate: number;
}

export type SymbolCode = string;

export interface CryptoCurrency {
  id: number;
  symbol: SymbolCode;
  url: string;
  imageUrl: string;
}

interface CoinInfo {
  Id: number;
  Name: SymbolCode;
  FullName: string;
  Internal: string;
  ImageUrl: string;
  Url: string;
  Algorithm: string;
  ProofType: string;
  Rating: Rating;
  NetHashesPerSecond: number;
  BlockNumber: number;
  BlockTime: number;
  BlockReward: number;
  Type: number;
  DocumentType: string;
}

interface Rating {
  Rating: {
    Weiss: {
      Rating: string
      TechnologyAdoptionRating: string
      MarketPerformanceRating: string
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class CryptoCurrencyApiService {
  constructor(private httpClient: HttpClient) { }

  public getCryptoCurrenciesExchangeRates(convertToCurrencySymbol: string, currencySymbols: string[]): Observable<CurrencyExchangeRate[]> {
    return this.httpClient.get(`${environment.cryptoCompareBaseUrl}/pricemulti?fsyms=${convertToCurrencySymbol}&tsyms=${currencySymbols.join(',')}`, httpOptions)
      .pipe(map((response: { compareFromCurrencySymbol: {} }): CurrencyExchangeRate[] => Object.entries(response[convertToCurrencySymbol]).map(_ => ({ symbol: _[0], exchangeRate: _[1] as number }))));
  }

  public getTopCryptoCurrenciesBy24HourVolume(convertToCurrencySymbol: string, topNumberOfCoins: number): Observable<CryptoCurrency[]> {
    return this.httpClient.get(`${environment.cryptoCompareBaseUrl}/top/totalvolfull?limit=${topNumberOfCoins}&tsym=${convertToCurrencySymbol}`, httpOptions)
      .pipe(
        map((response: { Data: [{ CoinInfo: CoinInfo }] }): CryptoCurrency[] =>
          response.Data.map(data => ({
            id: data.CoinInfo.Id,
            symbol: data.CoinInfo.Name,
            url: data.CoinInfo.Url,
            imageUrl: `https://www.cryptocompare.com${data.CoinInfo.ImageUrl}`
          }))
        )
      );
  }
}
