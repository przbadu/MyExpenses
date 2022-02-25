import {numToMonthName, numToWeekName} from '..';

test('numToMonthName', async () => {
  expect(numToMonthName(1)).toBe('Jan');
  expect(numToMonthName(2)).toBe('Feb');
  expect(numToMonthName(3)).toBe('Mar');
  expect(numToMonthName(4)).toBe('Apr');
  expect(numToMonthName(5)).toBe('May');
  expect(numToMonthName(6)).toBe('Jun');
  expect(numToMonthName(7)).toBe('Jul');
  expect(numToMonthName(8)).toBe('Aug');
  expect(numToMonthName(9)).toBe('Sep');
  expect(numToMonthName(10)).toBe('Oct');
  expect(numToMonthName(11)).toBe('Nov');
  expect(numToMonthName(12)).toBe('Dec');
});

test('numToWeekName', async () => {
  expect(numToWeekName(0)).toBe('Sun');
  expect(numToWeekName(1)).toBe('Mon');
  expect(numToWeekName(2)).toBe('Tue');
  expect(numToWeekName(3)).toBe('Wed');
  expect(numToWeekName(4)).toBe('Thu');
  expect(numToWeekName(5)).toBe('Fri');
  expect(numToWeekName(6)).toBe('Sat');
});
