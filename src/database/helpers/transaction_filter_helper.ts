import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';

import {formatDateColumn, transactions} from '.';
const _format = 'YYYY-MM-DD';

/**
 * Transaction filter props
 */
export interface filterTransactionByProps {
  categoryIds?: number[] | string[];
  walletIds?: number[] | string[];
  startDate?: Date;
  endDate?: Date;
}

/**
 * @param q - existing query string
 * @param filterBy - filterBy params
 * @returns appended query, and additional query arguments to skip SQL injection attack.
 */
function prepareStartEndDateRawQuery(
  q: string,
  filterBy: filterTransactionByProps,
) {
  if (filterBy?.startDate && filterBy?.endDate) {
    const startDate = dayjs(filterBy.startDate).format(_format);
    const endDate = dayjs(filterBy.endDate).format(_format);

    let query = q.includes('WHERE') ? ' AND ' : ' WHERE ';
    query += `${formatDateColumn('%Y-%m-%d')} BETWEEN ? and ?`;
    const args = [startDate, endDate];

    return {query, args};
  } else {
    return {query: '', args: []};
  }
}

function inRawQuery(q: string, columnName: string, ids: string[] | number[]) {
  if (ids?.length) {
    let query = q.includes('WHERE') ? ' AND ' : ' WHERE ';
    let args: any[] = [];

    // prepare first id
    const firstId = ids[0];
    query += `${columnName} = ?`;
    args.push(firstId);
    ids.map(id => {
      if (id !== firstId) {
        query += ` OR ${columnName} = ?`;
        args.push(id);
      }
    });
    return {query, args};
  } else {
    return {query: '', args: []};
  }
}

function applyRawQueryFilter(filterBy: filterTransactionByProps) {
  let query = '';
  let args: any = [];

  // filter by start and end dates
  const dateFilter = prepareStartEndDateRawQuery(query, filterBy!);
  query += dateFilter.query;
  args = [...args, ...dateFilter.args];

  // filter by category ids
  const categoryFilter = inRawQuery(
    query,
    'category_id',
    filterBy?.categoryIds!,
  );
  query += categoryFilter.query;
  args = [...args, ...categoryFilter.args];

  // filter by wallet ids
  const walletFilter = inRawQuery(query, 'wallet_id', filterBy?.walletIds!);
  query += walletFilter.query;
  args = [...args, ...walletFilter.args];

  return {query, args};
}

/**
 * @returns Return sum(amount) for income and expense type transactions
 */
export function transactionTypeSummary(
  filterBy: filterTransactionByProps | null = null,
) {
  let args: any = [];
  let query =
    "select transaction_type, SUM(amount) as sum_amount from transactions WHERE _status IS NOT 'deleted'";

  // filter by start and end dates
  const filter = applyRawQueryFilter(filterBy!);
  query += filter.query;
  args = [...args, ...filter.args];

  query += ' group by transaction_type';
  query += ' order by transaction_type DESC';
  return transactions.query(Q.unsafeSqlQuery(query, args)).unsafeFetchRaw();
}

/**
 *
 * @param filterBy  - combination of below params:
 * categoryIds - list of category ids
 * walletIds - List of wallet ids
 * startDate - Start date in YYYY-MM-DD
 * endDate - end date in YYYY-MM-DD
 * @returns Filter transactions for given filterBy criterias and return list of Transactions if any
 */
export function filterTransactions(
  filterBy: filterTransactionByProps | null = null,
) {
  let useQuery = [];
  // Filter by transaction date
  if (filterBy?.startDate && filterBy.endDate) {
    const startTime = +dayjs(filterBy.startDate).startOf('month');
    const endTime = +dayjs(filterBy.endDate);
    useQuery.push(
      Q.and(
        Q.where('transaction_at', Q.gte(startTime)),
        Q.where('transaction_at', Q.lte(endTime)),
      ),
    );
  }
  // filter by category ids
  if (filterBy?.categoryIds) {
    let categoryIdsQuery: any = [];
    filterBy.categoryIds.map(id =>
      categoryIdsQuery.push(Q.where('category_id', id)),
    );
    useQuery.push(Q.or(...categoryIdsQuery));
  }
  // filter by wallet ids
  if (filterBy?.walletIds) {
    let walletIdsQuery: any = [];
    filterBy.walletIds.map(id => walletIdsQuery.push(Q.where('wallet_id', id)));
    useQuery.push(Q.or(...walletIdsQuery));
  }

  return transactions.query(...useQuery).fetch();
}
