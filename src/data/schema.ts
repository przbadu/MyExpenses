import {appSchema, tableSchema} from '@nozbe/watermelondb/Schema';
import {TableName} from './tableName';

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: TableName.WALLETS,
      columns: [
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'balance_amount', type: 'number'},
        {name: 'is_default', type: 'boolean'},
        {name: 'is_archived', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: TableName.CATEGORIES,
      columns: [
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: TableName.TRANSACTIONS,
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
  ],
});
