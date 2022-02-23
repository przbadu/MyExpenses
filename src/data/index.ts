import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import appSchema from './schema'
import migrations from './migrations';

const adapter: SQLiteAdapter = new SQLiteAdapter({
  dbName: 'myexpenses.db',
  schema: appSchema,
  migrations: migrations,
});

export const database: Database = new Database({
  adapter,
  modelClasses: [],
});