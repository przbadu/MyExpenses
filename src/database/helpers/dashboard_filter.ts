import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import {filterTransactionByProps, formatDateColumn, transactions} from '.';

dayjs.extend(quarterOfYear);

export type lineChartFilterProps = 'y' | 'q' | 'm' | 'w';

const labels = {
  yearly: '%m',
  quarterly: '%m',
  monthly: '%d',
  weekly: '%w',
};

export const lineChartData = (
  filter: lineChartFilterProps,
  transactionType: 'Income' | 'Expense' = 'Expense',
) => {
  let format = labels.yearly;
  if (filter === 'y') format = labels.yearly;
  else if (filter === 'q') format = labels.quarterly;
  else if (filter === 'w') format = labels.weekly;
  else format = labels.monthly;

  let dateFilter;
  if (filter === 'y') {
    dateFilter = ` ${formatDateColumn('%Y')} = '${dayjs().format('YYYY')}'`;
  } else if (filter === 'q') {
    let start = dayjs().startOf('quarter').format('YYYY-MM');
    let end = dayjs().endOf('quarter').format('YYYY-MM');
    dateFilter = ` ${formatDateColumn(
      '%Y-%m',
    )} >= '${start}' AND ${formatDateColumn('%Y-%m')} <= '${end}'`;
  } else if (filter == 'm')
    dateFilter = ` ${formatDateColumn('%Y-%m')} = '${dayjs().format(
      'YYYY-MM',
    )}'`;
  else if (filter == 'w') {
    const start = dayjs().startOf('w').format('YYYY-MM-DD');
    const end = dayjs().endOf('w').format('YYYY-MM-DD');
    dateFilter = ` ${formatDateColumn(
      '%Y-%m-%d',
    )} >= '${start}' AND ${formatDateColumn('%Y-%m-%d')} <= '${end}'`;
  } else
    dateFilter = ` ${formatDateColumn('%Y')} = '${dayjs().format('YYYY')}'`;

  const query =
    `SELECT ${formatDateColumn(format)} as date, sum(amount) as amount` +
    ' FROM transactions' +
    ` WHERE ${dateFilter}` +
    " AND _status IS NOT 'deleted' AND transaction_type = ?" +
    ' GROUP BY date' +
    ' ORDER BY date';

  console.log('ineChartData: ', query);

  return transactions
    .query(Q.unsafeSqlQuery(query, [transactionType]))
    .unsafeFetchRaw();
};

export const lineChartIncomeData = (filter: lineChartFilterProps) => {
  let format = labels.yearly;
  if (filter === 'y') format = labels.yearly;
  else if (filter === 'w') format = labels.weekly;
  else format = labels.monthly;

  const query =
    `SELECT ${formatDateColumn(format)} as date, sum(amount) as amount` +
    ' FROM transactions' +
    ` WHERE ${formatDateColumn('%Y')} = '${dayjs().format('YYYY')}'` +
    " AND _status IS NOT 'deleted' AND transaction_type = 'Expense'" +
    ' GROUP BY date' +
    ' ORDER BY date';

  console.log('lineChartIncomeData: ', query);

  return transactions.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
};
