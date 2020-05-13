import { TestBed } from '@angular/core/testing';

import { CryptoCurrencyWebSocketService } from './crypto-currency-websocket.service';

describe('CryptoCurrencyWebsocketService', () => {
  let service: CryptoCurrencyWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoCurrencyWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
