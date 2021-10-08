import {Q} from '@nozbe/watermelondb';
import {database} from '../index';
import {Category, Transaction, TransactionProps, Wallet} from '../models';

// This method will find category or wallet for given names
const getRecordBy = async (
  columnName: string,
  values: string[],
  tableName: string,
) => {
  let valueQuery: any = [];
  let useQuery = [];
  values.map(value => valueQuery.push(Q.where(columnName, value)));
  useQuery.push(Q.or(...valueQuery));
  return database.collections
    .get(tableName)
    .query(...useQuery)
    .fetch();
};

// this method will prepare new category or wallet for bulk creation/insertion
const prepareCategoryOrWallet = async (tableName: string, name: string) => {
  return database.collections.get(tableName).prepareCreate(item => {
    item.name = name;
  });
};

// this method will prepare new transaction for bulk creation/insertion
const prepareNewTransaction = async (
  row: any,
  wallet: Wallet,
  category: Category,
) => {
  return database.collections
    .get(Transaction.table)
    .prepareCreate(transaction => {
      transaction.amount = row['Amount'];
      transaction.notes = row['Notes'];
      transaction.time = row['Time'];
      transaction.transactionAt = row['Date'];
      transaction.transactionType = row['Type'];
      transaction.wallet.set(wallet);
      transaction.category.set(category);
    });
};

// this method will prepare transaction for bulk update
const prepareUpdateTransaction = async (
  row: any,
  transaction: Transaction,
  wallet: Wallet,
  category: Category,
) => {
  return transaction.prepareUpdate(trans => {
    trans.id = row['Id'];
    trans.amount = row['Amount'];
    trans.notes = row['Notes'];
    trans.time = row['Time'];
    trans.transactionAt = row['Date'];
    trans.transactionType = row['Type'];
    trans.wallet.set(wallet);
    trans.category.set(category);
  });
};

export const bulkImportTransaction = async (data: any[]) => {
  // collect wallet names
  const uniqWalletNames = [...new Set(data.map(row => row['Wallet']))];
  let wallets = await getRecordBy('name', uniqWalletNames, Wallet.table);
  // find new wallets and create them
  const existingWalletNames = wallets.map(wallet => wallet.name);
  const newWalletNames = uniqWalletNames.filter(
    name => !existingWalletNames.includes(name),
  );
  // collect category names
  const uniqCategoryNames = [...new Set(data.map(row => row['Category']))];
  let categories = await getRecordBy('name', uniqCategoryNames, Category.table);
  const existingCategoryNames = categories.map(category => category.name);
  const newCategoryNames = uniqCategoryNames.filter(
    name => !existingCategoryNames.includes(name),
  );

  // create new categories in bulk
  const categoryWallets = [
    ...newWalletNames.map(name => prepareCategoryOrWallet(Wallet.table, name)),
    ...newCategoryNames.map(name =>
      prepareCategoryOrWallet(Category.table, name),
    ),
  ];
  await database.write(async () => {
    await database.batch(...categoryWallets);
  });

  // find and append new categories and wallets to existing array
  const _newWallets = await getRecordBy('name', newWalletNames, Wallet.table);
  const _newCategories = await getRecordBy(
    'name',
    newCategoryNames,
    Category.table,
  );

  categories = [...categories, ..._newCategories];
  wallets = [...wallets, ..._newWallets];

  console.log('Wallets', wallets);
  console.log('Category', categories);

  // Find Transactions with id, used for update
  const transactionsToCreate = data.filter(row => !row['Id']);
  // Find transactions without id, used for creation
  const transactionsToUpdate = data.filter(row => !!row['Id']);
  const uniqTransactionIds = [
    ...new Set(transactionsToUpdate.map(row => row['Id'])),
  ];
  const existingTransactions = await getRecordBy(
    'id',
    uniqTransactionIds,
    Transaction.table,
  );

  // TODO: fix category id and wallet id for each transactions
  const batchTransactions = [
    ...transactionsToCreate.map(row => {
      const wallet = wallets.find(wallet => wallet.name === row['Wallet']);
      const category = categories.find(
        category => category.name === row['Category'],
      );

      return prepareNewTransaction(row, wallet as Wallet, category as Category);
    }),

    ...existingTransactions.map(transaction => {
      const row = transactionsToUpdate.find(
        _row => _row['Id'] == transaction.id,
      );
      const wallet = wallets.find(wallet => wallet.name === row['Wallet']);
      const category = categories.find(
        category => category.name === row['Category'],
      );

      return prepareUpdateTransaction(
        row,
        transaction as Transaction,
        wallet as Wallet,
        category as Category,
      );
    }),
  ];

  database.write(async () => {
    await database.batch(...batchTransactions);
  });
};
