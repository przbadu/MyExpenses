import currency from 'currency.js';

export * from './theme';
export * from './currencies';

export const numberToCurrency = (amount: number, symbol: string = 'Rs.') =>
  currency(amount, {symbol: `${symbol} `}).format();
