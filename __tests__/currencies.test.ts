import {numberToCurrency} from '../src/lib';

test('should return currency formatted amount in default currency symbol', () => {
  const amount = numberToCurrency(10000, '$');
  expect(amount).toBe('$10,000.00');
});
