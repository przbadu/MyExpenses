import dayjs from 'dayjs';
import {database} from '../index';
import {Transaction, TransactionProps, TransactionTypeEnum} from '../models';

const transactions = database.collections.get(Transaction.table);

export const observeTransactions = () => transactions.query().observe();

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
      entry.categoryId = categoryId;
      entry.walletId = walletId;
      entry.isPaid = isPaid;
      entry.transactionAt = transactionAt;
      entry.time = time;
      entry.transactionType = transactionType;
    });
  });
};
