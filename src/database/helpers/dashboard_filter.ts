import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';

import {formatDateColumn, transactions} from '.';

export type lineChartFilterProps = 'yearly' | 'monthly' | 'weekly';

const labels = {
  yearly: '%m',
  monthly: '%d',
  weekly: '%w',
};

export const lineChartData = (filter: lineChartFilterProps) => {
  let format = labels.yearly;
  if (filter === 'monthly') format = labels.monthly;
  else if (filter === 'weekly') format = labels.weekly;
  else format = labels.yearly;

  const query =
    `SELECT ${formatDateColumn(format)} as date, sum(amount) as amount` +
    ' FROM transactions' +
    ` WHERE ${formatDateColumn('%Y')} = '${dayjs().format('YYYY')}'` +
    " AND _status IS NOT 'deleted' AND transaction_type = 'Expense'" +
    ' GROUP BY date' +
    ' ORDER BY date';

  console.log('query', query);

  return transactions.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
};
