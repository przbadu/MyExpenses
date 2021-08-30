import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  relation,
  writer,
} from '@nozbe/watermelondb/decorators';

// category enum, we only support income and expense type category for now
export enum TransactionTypeEnum {
  income = 'Income',
  expense = 'Expense',
}

export interface TransactionProps {
  amount: number;
  notes: string;
  transactionDateAt?: Date;
  isPaid?: boolean;
  transactionType?: TransactionTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
  paymentModeId?: string | number;
  categoryId?: string | number;
}

class Transaction extends Model {
  // table name
  static table = 'transactions';

  // attributes
  @date('transaction_date_at') transactionDateAt: Date | any;
  @field('notes') notes: String | any;
  @field('amount') amount: Number | any;
  @field('is_paid') isPaid: Boolean | any;
  @field('transaction_type') transactionType: TransactionTypeEnum | any;
  @readonly @date('created_at') createdAt: Date | any;
  @readonly @date('updated_at') updatedAt: Date | any;

  // associations/relationships
  @relation('payment_mode', 'payment_mode_id') paymentMode: any;
  @relation('category', 'category_id') category: any;

  @writer async markAsUnpaid() {
    await this.update(transaction => [(transaction.isPaid = false)]);
  }

  @writer async markAsPaid() {
    await this.update(transaction => [(transaction.isPaid = true)]);
  }
}

export {Transaction};
