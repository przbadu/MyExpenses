import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import {wallets} from '.';
import {database} from '../index';
import {
  Category,
  Transaction,
  TransactionProps,
  TransactionTypeEnum,
  Wallet,
} from '../models';
const now = new Date();

/**
 * Transaction collection, used for making further queries to this table.
 */
export const transactions = database.collections.get(Transaction.table);

/**
 *
 * @param format %Y %m %d (SQLITE supported date formats)
 * @param column column name to be formated, must be date column, default: transaction_at
 * @returns SQL string to support date format e.g: strftime("%Y-%m", datetime(transaction_at/1000, 'unixepoch'))
 */
export const formatDateColumn = (
  format: string,
  column: string = 'transaction_at',
) => `strftime("${format}", datetime(${column}/1000, "unixepoch"))`;

/**
 * @returns return all Transactions and observe them for changes
 */
export const observeTransactions = () => {
  const timestamp = new Date().getTime();
  const startTime = +dayjs(timestamp).startOf('year');
  const endTime = +dayjs(timestamp).endOf('year');

  return transactions
    .query(
      Q.and(
        Q.where('transaction_at', Q.gte(startTime)),
        Q.where('transaction_at', Q.lte(endTime)),
      ),
    )
    .observe();
};

/**
 * @param date - must be in "%Y-%m" format, e.g: "2021-01"
 * @returns
 */
export const transactionDaysForCurrentMonth = (date: string) => {
  return transactions
    .query(
      Q.unsafeSqlQuery(
        'SELECT transaction_at FROM transactions' +
          ` WHERE ${formatDateColumn('%Y-%m')} = ?` +
          ` AND _status IS NOT 'deleted'`,
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
        Q.where('transaction_at', Q.gte(startTime)),
        Q.where('transaction_at', Q.lte(endTime)),
      ),
    )
    .fetch();
};

export const uncategorizedId = () =>
  database.collections
    .get(Category.table)
    .query(Q.where('name', 'Uncategorized'))
    .fetchIds();

export const transactionCount = (category_id: number | string | undefined) => {
  const query = `SELECT COUNT(*) AS count FROM transactions WHERE category_id = ? AND _status IS NOT 'deleted'`;

  console.log('query', query, category_id);
  return transactions
    .query(Q.unsafeSqlQuery(query, [category_id]))
    .observeCount();
};

export const transactionSum = (category_id: number | string | undefined) => {
  const query = `SELECT SUM(amount) AS sum FROM transactions WHERE category_id = ? AND _status IS NOT 'deleted'`;

  console.log('query', query, category_id);
  return transactions.query(Q.unsafeSqlQuery(query, [category_id])).observe();
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
  if (!categoryId) {
    categoryId = (await uncategorizedId())[0];
  }
  await database.write(async () => {
    const wallet = (await wallets.find(walletId as string)) as Wallet;
    let balance = wallet.balanceAmount;
    transactionType == TransactionTypeEnum.expense
      ? (balance -= Number(amount))
      : (balance += Number(amount));

    await transactions.create(entry => {
      entry.amount = Number(amount);
      entry.notes = notes;
      entry.category.id = categoryId;
      entry.wallet.id = walletId;
      entry.wallet.balanceAmount = balance;
      entry.isPaid = isPaid;
      entry.transactionAt = transactionAt;
      entry.time = time;
      entry.transactionType = transactionType;
    });
    await wallet.update(() => {
      wallet.balanceAmount = balance;
    });
  });
};

export const updateTransaction = async (
  id: string,
  {
    amount,
    notes,
    categoryId,
    walletId,
    isPaid,
    transactionAt,
    time,
    transactionType,
  }: TransactionProps,
) => {
  const transaction = (await transactions.find(id)) as Transaction;

  if (!transaction) {
    saveTransaction({
      amount,
      notes,
      categoryId,
      walletId,
      isPaid,
      transactionAt,
      time,
      transactionType,
    } as TransactionProps);
  } else {
    await database.write(async () => {
      const wallet = (await wallets.find(walletId as string)) as Wallet;
      let balance = wallet.balanceAmount;
      transactionType == TransactionTypeEnum.expense
        ? (balance -= Number(amount))
        : (balance += Number(amount));
      await transaction.update(() => {
        transaction.amount = Number(amount);
        transaction.notes = notes;
        transaction.category.id = categoryId;
        // transaction.wallet.id = walletId; # don't allow wallet update
        transaction.isPaid = isPaid;
        transaction.transactionAt = transactionAt;
        transaction.time = time;
        transaction.transactionType = transactionType;
      });
      await wallet.update(() => {
        wallet.balanceAmount = balance;
      });
    });
  }
};

export const deleteTransaction = async (id: string) => {
  const transaction = (await transactions.find(id)) as Transaction;
  await database.write(async () => {
    const wallet = await transaction.wallet;
    let balance = wallet.balanceAmount;
    transaction.transactionType == TransactionTypeEnum.expense
      ? (balance += transaction.amount)
      : (balance -= transaction.amount);
    await wallet.update(() => {
      wallet.balanceAmount = balance;
    });
    await transaction.destroyPermanently();
  });
};
