import dayjs from 'dayjs';
import {Q} from '@nozbe/watermelondb';
import {database} from '../index';
import {
  Category,
  Transaction,
  TransactionProps,
  TransactionTypeEnum,
} from '../models';
const now = new Date();

/**
 * Transaction collection, used for making further queries to this table.
 */
const transactions = database.collections.get(Transaction.table);

/**
 * @returns return all Transactions and observe them for changes
 */
export const observeTransactions = () => transactions.query().observe();

/**
 * @returns List of transactions for current year
 */
export const observeCurrentYearTransactions = () =>
  transactions.query(
    Q.unsafeSqlQuery(
      'SELECT *, strftime("%m", datetime(transaction_at/1000, "unixepoch")) as "month" FROM transactions' +
        ' order by transaction_at DESC',
    ),
  );

/**
 * @param date - must be in "%Y-%m" format, e.g: "2021-01"
 * @returns
 */
export const transactionDaysForCurrentMonth = (date: string) => {
  return transactions
    .query(
      Q.unsafeSqlQuery(
        'SELECT transaction_at FROM transactions' +
          ' WHERE strftime("%Y-%m", datetime(transaction_at/1000, "unixepoch")) = ?',
        [date],
      ),
    )
    .unsafeFetchRaw();
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

export const uncategorizedId = () =>
  database.collections
    .get(Category.table)
    .query(Q.where('name', 'Uncategorized'))
    .fetchIds();

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
  if (!categoryId) {
    categoryId = (await uncategorizedId())[0];
  }
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
