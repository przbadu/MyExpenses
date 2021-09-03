import {
  addColumns,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';
import {Category, Wallet} from './models';

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
  ],
});
