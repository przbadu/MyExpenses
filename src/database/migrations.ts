import {
  addColumns,
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';
import {Category, Transaction, Wallet} from './models';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: Category.table,
          columns: [{name: 'color', type: 'string'}],
        }),
        addColumns({
          table: Wallet.table,
          columns: [{name: 'color', type: 'string'}],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: Transaction.table,
          columns: [{name: 'time', type: 'string'}],
        }),
      ],
    },
  ],
});
