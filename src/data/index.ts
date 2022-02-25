import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import appSchema from './schema';
import migrations from './migrations';
import {Alert, Platform} from 'react-native';

let adapter: SQLiteAdapter | LokiJSAdapter;

if (process.env.NODE_ENV === 'test') {
  adapter = new LokiJSAdapter({
    schema: appSchema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  });
} else {
  adapter = new SQLiteAdapter({
    dbName: 'myexpenses.db',
    schema: appSchema,
    migrations: migrations,
    jsi: Platform.OS === 'ios',
    onSetUpError: error => {
      Alert.alert('Error', error.message);
    },
  });
}

export const database: Database = new Database({
  adapter,
  modelClasses: [],
});
