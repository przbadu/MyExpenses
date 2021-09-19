import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import {database} from '../index';
import {Transaction} from '../models';
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
 * Transaction collection, used for making further queries to this table.
 */
const transactions = database.collections.get(Transaction.table);

/**
 * @param q - existing query string
 * @param filterBy - filterBy params
 * @returns appended query, and additional query arguments to skip SQL injection attack.
 */
function prepareStartEndDateQuery(
  q: string,
  filterBy: filterTransactionByProps,
) {
  if (filterBy?.startDate && filterBy?.endDate) {
    const startDate = dayjs(filterBy.startDate).format(_format);
    const endDate = dayjs(filterBy.endDate).format(_format);

    let query = q.includes('WHERE') ? ' AND ' : ' WHERE ';
    query +=
      'strftime("%Y-%m-%d", datetime(transaction_at/1000, "unixepoch")) BETWEEN ? and ?';
    const args = [startDate, endDate];

    return {query, args};
  } else {
    return {query: '', args: []};
  }
}

function prepareCategoryQuery(q: string, filterBy: filterTransactionByProps) {
  if (filterBy?.categoryIds) {
    let query = q.includes('WHERE') ? ' AND ' : ' WHERE ';
    query += 'category_id IN (?)';
    const args = [filterBy.categoryIds];
    return {query, args};
  } else {
    return {query: '', args: []};
  }
}

function prepareWalletQuery(q: string, filterBy: filterTransactionByProps) {
  if (filterBy?.walletIds) {
    let query = q.includes('WHERE') ? ' AND ' : ' WHERE ';
    query += 'wallet_id IN (?)';
    const args = [filterBy.walletIds];
    return {query, args};
  } else {
    return {query: '', args: []};
  }
}

function applyFilter(q: string, filterBy: filterTransactionByProps) {
  let query = '';
  let args: any = [];

  // filter by start and end dates
  const dateFilter = prepareStartEndDateQuery(query, filterBy!);
  query += dateFilter.query;
  args = [...args, ...dateFilter.args];

  // filter by category ids
  const categoryFilter = prepareCategoryQuery(query, filterBy!);
  query += categoryFilter.query;
  args = [...args, ...categoryFilter.args];

  // filter by wallet ids
  const walletFilter = prepareWalletQuery(query, filterBy!);
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
    'select transaction_type, SUM(amount) as sum_amount from transactions';

  // filter by start and end dates
  const filter = applyFilter(query, filterBy!);
  query += filter.query;
  args = [...args, ...filter.args];

  query += ' group by transaction_type';
  query += ' order by transaction_type DESC';

  console.log('query', query);
  console.log('args', args);

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
  let args: any = [];
  let convertedColumns = ' transaction_at as transactionAt,';
  convertedColumns += ' transaction_type as transactionType, ';
  convertedColumns += ' wallet_id as walletId, ';
  convertedColumns += ' category_id as categoryId, ';
  const monthColumn =
    'strftime("%m", datetime(transaction_at/1000, "unixepoch"))';
  let query = `SELECT *, ${convertedColumns} ${monthColumn} as "month" FROM transactions`;

  const filter = applyFilter(query, filterBy!);
  query += filter.query;
  args = [...args, ...filter.args];

  query += ' order by transaction_at DESC';

  console.log('query', query);
  console.log('args', args);

  return transactions.query(Q.unsafeSqlQuery(query, args)).unsafeFetchRaw();
}
