import { Injectable } from '@angular/core';

export interface ExchangeRate {
  left: string;
  right: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompareService {


  constructor() { }

  compare(existingExchangeRates: ExchangeRate[] | null, newExchangeRates: ExchangeRate[]): { added: ExchangeRate[], removed: ExchangeRate[] } {
    const added = existingExchangeRates == null
      ? newExchangeRates
      : newExchangeRates.filter(newExchangeRate =>
        !existingExchangeRates
          .some(_ => _.left === newExchangeRate.left && _.right === newExchangeRate.right));

    const removed = existingExchangeRates == null
      ? []
      : existingExchangeRates.filter(existingExchangeRate =>
        !newExchangeRates
          .some(_ => _.left === existingExchangeRate.left && _.right === existingExchangeRate.right));

    return {
      added,
      removed
    };
  }
}
