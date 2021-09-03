import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

// schema
import schema from './schema';
import migrations from './migrations';

// models
import {Wallet, Category, Transaction} from './models';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: [Wallet, Category, Transaction],
});
