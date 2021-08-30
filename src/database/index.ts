import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

// schema
import schema from './schema';

// models
import {Wallet, Category, Transaction} from './models';

const adapter = new SQLiteAdapter({schema});

export const database = new Database({
  adapter,
  modelClasses: [Wallet, Category, Transaction],
});
