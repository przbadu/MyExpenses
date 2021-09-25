import currency from 'currency.js';

export const DefaultDateFormat = 'DD MMM YYYY';
export const DefaultTimeFormat = 'hh:mm A';

export * from './theme';
export * from './calendarTheme';
export * from './chartTheme';
export * from './currencies';

export const numberToCurrency = (
  amount: number | string,
  symbol: string = 'Rs.',
) => currency(amount, {symbol: `${symbol} `}).format();
