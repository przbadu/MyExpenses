import currency from 'currency.js';

export * from './theme';
export * from './currencies';

export const numToCurrency = (amount: number, symbol: string = 'Rs. ') =>
  currency(amount, {symbol}).format();
