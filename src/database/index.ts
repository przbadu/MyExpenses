import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import migrations from './migrations';
// models
import {Category, Saving, SavingAmount, Transaction, Wallet} from './models';
// schema
import schema from './schema';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: [Wallet, Category, Transaction, Saving, SavingAmount],
});
