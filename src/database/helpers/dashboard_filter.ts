import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import {lazy} from 'react';

import {formatDateColumn, transactions} from '.';

export const yearlySum = () =>
  transactions.query(
    Q.unsafeSqlQuery(
      `SELECT ${formatDateColumn('%m')} as date, sum(amount) as amount` +
        ' FROM transactions' +
        ` WHERE ${formatDateColumn('%Y')} = '${dayjs().format('YYYY')}'` +
        ' GROUP BY date' +
        ' ORDER BY amount',
    ),
  );

export const monthlySum = () =>
  transactions.query(
    Q.unsafeSqlQuery(
      `SELECT ${formatDateColumn('%d')} as date, sum(amount) as amount` +
        ' FROM transactions' +
        ` WHERE ${formatDateColumn('%Y-%m')} = '${dayjs().format('YYYY-MM')}'` +
        ' GROUP BY date' +
        ' ORDER BY date',
    ),
  );

export const weeklySum = () =>
  transactions.query(
    Q.unsafeSqlQuery(
      `SELECT ${formatDateColumn('%w')} as date, sum(amount) as amount` +
        ' FROM transactions' +
        ` WHERE ${formatDateColumn('%Y-%m')} = '${dayjs().format('YYYY-MM')}'` +
        ' GROUP BY date' +
        ' ORDER BY date',
    ),
  );

export const lineChartData = (filter: 'y' | 'm' | 'w' = 'y') => {
  switch (filter) {
    case 'y':
      return yearlySum().unsafeFetchRaw();
    case 'm':
      return monthlySum().unsafeFetchRaw();
    case 'w':
      return weeklySum().unsafeFetchRaw();
  }
};
