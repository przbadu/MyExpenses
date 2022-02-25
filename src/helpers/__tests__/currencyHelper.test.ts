import {numberToCurrency, numberToHumanize} from '..';

describe('#numberToCurrency', () => {
  it('should return currency formatted amount', async () => {
    expect(numberToCurrency(10000, '$')).toBe('$ 10,000.00');
    expect(numberToCurrency(10000, 'NPR')).toBe('NPR 10,000.00');
  });
});

describe('#numberToHumanize', () => {
  it('should return number in human readable format', async () => {
    // hundreds
    expect(numberToHumanize(100)).toBe('100.0');
    expect(numberToHumanize(500)).toBe('500.0');

    // thousands
    expect(numberToHumanize(1000)).toBe('1.0K');
    expect(numberToHumanize(1100)).toBe('1.1K');
    expect(numberToHumanize(1200)).toBe('1.2K');
    expect(numberToHumanize(10000)).toBe('10.0K');
    expect(numberToHumanize(100000)).toBe('100.0K');

    // millions
    expect(numberToHumanize(1000000)).toBe('1.0M');
    expect(numberToHumanize(1100000)).toBe('1.1M');
    expect(numberToHumanize(10000000)).toBe('10.0M');
    expect(numberToHumanize(100000000)).toBe('100.0M');

    // billion
    expect(numberToHumanize(1000000000)).toBe('1.0B');
    expect(numberToHumanize(10000000000)).toBe('10.0B');
    expect(numberToHumanize(100000000000)).toBe('100.0B');
  });
});
