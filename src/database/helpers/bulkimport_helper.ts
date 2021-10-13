import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import randomColor from 'randomcolor';
import {DefaultTimeFormat} from '../../lib';
import {database} from '../index';
import {Category, Transaction, Wallet} from '../models';

// This method will find category or wallet for given names
const getRecordBy = async (
  columnName: string,
  values: string[],
  tableName: string,
) => {
  if (!values.length) return [];

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
  return await database.collections.get(tableName).prepareCreate(item => {
    item.name = name;
    item.color = randomColor();
  });
};

// this method will prepare new transaction for bulk creation/insertion
const prepareNewTransaction = async (
  row: any,
  wallet: Wallet,
  category: Category,
) => {
  return await database.collections
    .get(Transaction.table)
    .prepareCreate(transaction => {
      transaction.amount = parseFloat(row['Amount']);
      transaction.notes = row['Notes'];
      transaction.time = row['Time'] || dayjs().format(DefaultTimeFormat);
      transaction.transactionAt = row['Date'] || new Date();
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
  return await transaction.prepareUpdate(trans => {
    trans.amount = parseFloat(row['Amount']);
    trans.notes = row['Notes'];
    trans.time = row['Time'] || dayjs().format(DefaultTimeFormat);
    trans.transactionAt = row['Date'] || new Date();
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

  let categoryWallets: any = [];
  // Map will not block async calls, use for loop
  for (const name of newWalletNames) {
    const _data = await prepareCategoryOrWallet(Wallet.table, name);
    categoryWallets.push(_data);
  }
  for (const name of newCategoryNames) {
    const _data = await prepareCategoryOrWallet(Category.table, name);
    categoryWallets.push(_data);
  }

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

  let batchTransactions = [];
  for (const row of transactionsToCreate) {
    const wallet = wallets.find(wallet => wallet.name === row['Wallet']);
    const category = categories.find(
      category => category.name === row['Category'],
    );

    batchTransactions.push(
      await prepareNewTransaction(row, wallet as Wallet, category as Category),
    );
  }

  for (const transaction of existingTransactions) {
    const row = transactionsToUpdate.find(_row => _row['Id'] == transaction.id);
    const wallet = wallets.find(wallet => wallet.name === row['Wallet']);
    const category = categories.find(
      category => category.name === row['Category'],
    );

    batchTransactions.push(
      await prepareUpdateTransaction(
        row,
        transaction as Transaction,
        wallet as Wallet,
        category as Category,
      ),
    );
  }

  database.write(async () => {
    await database.batch(...batchTransactions);
  });
};
