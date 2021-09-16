import dayjs from 'dayjs';
import {Q} from '@nozbe/watermelondb';
import {database} from '../index';
import {Transaction, TransactionProps, TransactionTypeEnum} from '../models';

const transactions = database.collections.get(Transaction.table);

// observe all transactions
export const observeTransactions = () => transactions.query().observe();

export const transactionTypeSummary = () =>
  transactions
    .query(
      Q.unsafeSqlQuery(
        'select transaction_type, SUM(amount) as sum_amount from transactions' +
          ' group by transaction_type',
      ),
    )
    .unsafeFetchRaw();

export const observeCurrentYearTransactions = () =>
  transactions.query(
    Q.unsafeSqlQuery(
      'SELECT *, strftime("%m", datetime(transaction_at/1000, "unixepoch")) as "month" FROM transactions' +
        ' order by transaction_at DESC',
    ),
  );

const now = new Date();
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
