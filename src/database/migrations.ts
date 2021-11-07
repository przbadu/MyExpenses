import {
  addColumns,
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';
import {Category, Saving, SavingAmount, Transaction, Wallet} from './models';

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
    {
      toVersion: 4,
      steps: [
        createTable({
          name: Saving.table,
          columns: [
            {name: 'title', type: 'string'},
            {name: 'required_amount', type: 'number'},
            {name: 'target_amount', type: 'number'},
            {name: 'fulfilled', type: 'boolean'},
            {name: 'onhold', type: 'boolean'},
            {name: 'created_at', type: 'number'},
            {name: 'updated_at', type: 'number'},
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        createTable({
          name: SavingAmount.table,
          columns: [
            {name: 'amount', type: 'number'},
            {name: 'created_at', type: 'number'},
          ],
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        addColumns({
          table: Wallet.table,
          columns: [{name: 'icon', type: 'string'}],
        }),
        addColumns({
          table: Category.table,
          columns: [{name: 'icon', type: 'string'}],
        }),
      ],
    },
  ],
});
