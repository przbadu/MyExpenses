import {appSchema, tableSchema} from '@nozbe/watermelondb/Schema';
import {Category, Transaction, Wallet} from './models';

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: Wallet.table,
      columns: [
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'balance_amount', type: 'number'},
        {name: 'is_default', type: 'boolean'},
        {name: 'is_archived', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: Category.table,
      columns: [
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: Transaction.table,
      columns: [
        {name: 'transaction_at', type: 'number'},
        {name: 'notes', type: 'string', isOptional: true},
        {name: 'amount', type: 'number'},
        {name: 'transaction_type', type: 'string'},
        {name: 'is_paid', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'wallet_id', type: 'string', isIndexed: true},
        {name: 'category_id', type: 'string', isIndexed: true},
      ],
    }),
  ],
});
