import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {GoogleDriveSync} from '../sync/google_drive/GoogleDriveDatabaseSync';
import migrations from './migrations';
// models
import {Category, Transaction, Wallet} from './models';
// schema
import schema from './schema';

const adapter: SQLiteAdapter = new SQLiteAdapter({
  schema,
  migrations,
});

export const database: Database = new Database({
  adapter,
  modelClasses: [Wallet, Category, Transaction],
});

export const googleDriveSync: GoogleDriveSync = new GoogleDriveSync();

export const resetDB = async (): Promise<void> =>
  await database.write(async () => {
    await database.collections.get(Wallet.table).query().markAllAsDeleted();
    await database.collections.get(Category.table).query().markAllAsDeleted();
    await database.collections
      .get(Transaction.table)
      .query()
      .markAllAsDeleted();
  });

// connecting other databases: https://github.com/panz3r/react-native-flipper-databases
if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const {
    connectDatabases,
    WatermelonDB,
  } = require('react-native-flipper-databases');

  connectDatabases([
    new WatermelonDB(database), // Pass in database definition
  ]);
}
