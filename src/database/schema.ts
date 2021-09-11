import {appSchema, tableSchema} from '@nozbe/watermelondb/Schema';
import {Category, Setting, Transaction, Wallet} from './models';

export default appSchema({
  version: 4,
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
        {name: 'time', type: 'string'},
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
    tableSchema({
      name: Setting.table,
      columns: [
        {name: 'currency', type: 'string'},
        {name: 'date_format', type: 'string'},
        {name: 'time_format', type: 'string'},
        {name: 'system_app_lock', type: 'boolean'},
      ],
    }),
  ],
});
