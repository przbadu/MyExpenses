import dayjs from 'dayjs';
import {Q} from '@nozbe/watermelondb';
import {database} from '../index';
import {Transaction, TransactionProps, TransactionTypeEnum} from '../models';
const now = new Date();

/**
 * Transaction collection, used for making further queries to this table.
 */
const transactions = database.collections.get(Transaction.table);

/**
 *
 * @returns return all Transactions and observe them for changes
 */
export const observeTransactions = () => transactions.query().observe();

/**
 *
 * @returns Return sum(amount) for income and expense type transactions
 */
export const transactionTypeSummary = () =>
  transactions
    .query(
      Q.unsafeSqlQuery(
        'select transaction_type, SUM(amount) as sum_amount from transactions' +
          ' group by transaction_type' +
          ' order by transaction_type DESC',
      ),
    )
    .unsafeFetchRaw();

/**
 *
 * @returns List of transactions for current year
 */
export const observeCurrentYearTransactions = () =>
  transactions.query(
    Q.unsafeSqlQuery(
      'SELECT *, strftime("%m", datetime(transaction_at/1000, "unixepoch")) as "month" FROM transactions' +
        ' order by transaction_at DESC',
    ),
  );

export const observeCalendarDots = () =>
  transactions
    .query(Q.unsafeSqlQuery('SELECT transaction_at FROM transactions'))
    .observe();

export type filterTransactionByProps = {
  categoryIds?: number[] | string[];
  walletIds?: number[] | string[];
  startDate?: Date;
  endDate?: Date;
};
/**
 *
 * @param filterBy  - combination of below params:
 * categoryIds - list of category ids
 * walletIds - List of wallet ids
 * startDate - Start date
 * endDate - end date
 * @returns Filter transactions for given filterBy criterias and return list of Transactions if any
 */
export const filterTransactions = (
  filterBy: filterTransactionByProps | null = null,
) => {
  return transactions.query().fetch();
};

/**
 * Find list of transactions for given day
 * @param date - date string e.g: "2021-01-01"
 * @returns - List of transactions for given date
 */
export const filterByDailyTransactions = (date: string) => {
  const timestamp = new Date(date).getTime();
  const startTime = +dayjs(timestamp).startOf('day');
  const endTime = +dayjs(timestamp).endOf('day');

  return transactions
    .query(
      Q.and(
        Q.where('transaction_at', Q.gt(startTime)),
        Q.where('transaction_at', Q.lt(endTime)),
      ),
    )
    .fetch();
};

/**
 * Create new transaction in database
 * @param amount - transaction amount
 * @param notes - transaction notes
 * @param categoryId - category id
 * @param walletId - wallet id
 * @param isPaid - default true, if it is unpaid transaction, send false
 * @param transactionAt - transaction date
 * @param time - transaction time
 * @transactionType - Income / Expense
 */
export const saveTransaction = async ({
  amount,
  notes,
  categoryId,
  walletId,
  isPaid = true,
  transactionAt = now,
  time = dayjs(now).format('HH:mm'),
  transactionType = TransactionTypeEnum.expense,
}: TransactionProps) => {
  await database.write(async () => {
    await transactions.create(entry => {
      entry.amount = Number(amount);
      entry.notes = notes;
      entry.category.id = categoryId;
      entry.wallet.id = walletId;
      entry.isPaid = isPaid;
      entry.transactionAt = transactionAt;
      entry.time = time;
      entry.transactionType = transactionType;
    });
  });
};
