import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CryptoCurrencyApiService } from './crypto-currency-api.service';
import { getStubCryptoCurrenciesExchangeRates, getStubTopCryptoCurrenciesBy24HourVolumeResponse } from 'src/test/data';

describe('CryptoCurrencyApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CryptoCurrencyApiService]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', inject([HttpTestingController, CryptoCurrencyApiService],
    (service: CryptoCurrencyApiService) => {
      expect(service).toBeTruthy();
    })
  );

  describe('getCryptoCurrenciesExchangeRates', () => {
    it('should return top crypto currencies by volume in last 24 hours',
      inject([HttpTestingController, CryptoCurrencyApiService],
        (httpMock: HttpTestingController, service: CryptoCurrencyApiService) => {
          let currencyExchangeRates;
          const currencySymbols = 'BTC,ETH,EOS,BCH,ETC,LTC,BSV,BNB,TUSD,XRP,XLM,DASH,LINK,PAX,QTUM,XTZ,TRX,NEO,OKB,ATOM'.split(',');
          service.getCryptoCurrenciesExchangeRates('USD', currencySymbols).subscribe(result => {
            currencyExchangeRates = result;
          });

          httpMock.expectOne(req => {
            return req.url.includes('pricemulti');
          }).flush(getStubCryptoCurrenciesExchangeRates());

          expect(currencyExchangeRates.length).toBeGreaterThan(0);
        })
    );
  });

  describe('getTopCryptoCurrenciesBy24HourVolume', () => {
    it('should return top crypto currencies by volume in last 24 hours',
      inject([HttpTestingController, CryptoCurrencyApiService],
        (httpMock: HttpTestingController, service: CryptoCurrencyApiService) => {
          let cryptoCurrencies;
          service.getTopCryptoCurrenciesBy24HourVolume('USD', 10).subscribe(result => {
            cryptoCurrencies = result;
          });

          httpMock.expectOne(req => {
            return req.url.includes('top/totalvolfull');
          }).flush(getStubTopCryptoCurrenciesBy24HourVolumeResponse());

          expect(cryptoCurrencies.length).toBeGreaterThan(0);
        })
    );
  });
});


