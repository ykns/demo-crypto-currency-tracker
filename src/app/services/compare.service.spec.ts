import { TestBed } from '@angular/core/testing';

import { CompareService } from './compare.service';

describe('CompareService', () => {
  let service: CompareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('compare', () => {
    describe('given new exchange rates which all do not match', () => {
      it('should show all of the existing exchange rates as removed and all of the new exchange rates as added', () => {
        const existingExchangeRates = [{
          left: 'BTC',
          right: 'USD',
        },
        {
          left: 'ETH',
          right: 'USD',
        },
        {
          left: 'XRP',
          right: 'USD',
        },
        {
          left: 'BCH',
          right: 'USD',
        }];
        const newExchangeRates = existingExchangeRates.map(_ => ({ ..._, right: 'GBP' }));

        const diff = service.compare(existingExchangeRates, newExchangeRates);

        expect(diff.added.every(_ => _.right === 'GBP')).toBe(true);
        expect(diff.added.length).toBe(newExchangeRates.length);
        expect(diff.removed.every(_ => _.right === 'USD')).toBe(true);
        expect(diff.removed.length).toBe(existingExchangeRates.length);
      });
    });

    describe('given new exchange rate which some match', () => {
      it('should show some of the existing exchange rates as removed and some of the new exchange rates as added', () => {
        const existingExchangeRates = [{
          left: 'BTC',
          right: 'USD',
        },
        {
          left: 'ETH',
          right: 'USD',
        },
        {
          left: 'XRP',
          right: 'USD',
        },
        {
          left: 'BCH',
          right: 'USD',
        }];
        const newExchangeRates = Object.assign([], existingExchangeRates, { 1: { left: 'ETH', right: 'GBP' } }, { 2: { left: 'XRP', right: 'GBP' } });

        const diff = service.compare(existingExchangeRates, newExchangeRates);

        expect(diff.added.every(_ => _.right === 'GBP')).toBe(true);
        expect(diff.added.length).toBe(2);
        expect(diff.removed.every(_ => _.right === 'USD')).toBe(true);
        expect(diff.removed.length).toBe(2);
      });
    });

    describe('given new exchange rate which all match', () => {
      it('should show none of existing exchange rates as removed and none of the new exchange rates as added', () => {
        const existingExchangeRates = [{
          left: 'BTC',
          right: 'USD',
        },
        {
          left: 'ETH',
          right: 'USD',
        },
        {
          left: 'XRP',
          right: 'USD',
        },
        {
          left: 'BCH',
          right: 'USD',
        }
        ];
        const newExchangeRates = [...existingExchangeRates];

        const diff = service.compare(existingExchangeRates, newExchangeRates);

        expect(diff.added.length).toBe(0);
        expect(diff.removed.length).toBe(0);
      });
    });
  });
});
