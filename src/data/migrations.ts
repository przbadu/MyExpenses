import {
  addColumns,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';
import {TableName} from './tableName';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: TableName.CATEGORIES,
          columns: [{name: 'color', type: 'string'}],
        }),
        addColumns({
          table: TableName.WALLETS,
          columns: [{name: 'color', type: 'string'}],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: TableName.TRANSACTIONS,
          columns: [{name: 'time', type: 'string'}],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: TableName.WALLETS,
          columns: [{name: 'icon', type: 'string'}],
        }),
        addColumns({
          table: TableName.CATEGORIES,
          columns: [{name: 'icon', type: 'string'}],
        }),
      ],
    },
  ],
});
