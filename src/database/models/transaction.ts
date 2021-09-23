import Model from '@nozbe/watermelondb/Model';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import date from '@nozbe/watermelondb/decorators/date';
import relation from '@nozbe/watermelondb/decorators/relation';
import {writer} from '@nozbe/watermelondb/decorators/action';
import {CategoryProps, WalletProps} from '.';

// category enum, we only support income and expense type category for now
export enum TransactionTypeEnum {
  income = 'Income',
  expense = 'Expense',
}

export interface TransactionProps {
  id?: number | string;
  amount: string | number;
  notes: string;
  transactionAt?: Date;
  time?: string;
  isPaid?: boolean;
  transactionType?: TransactionTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
  walletId?: string | number | null;
  categoryId?: string | number | null;
  wallet: WalletProps;
  category: CategoryProps;
}

class Transaction extends Model {
  // table name
  static table = 'transactions';

  // attributes
  @date('transaction_at') transactionAt: Date | any;
  @field('time') time: string | any;
  @field('notes') notes: String | any;
  @field('amount') amount: Number | any;
  @field('is_paid') isPaid: Boolean | any;
  @field('transaction_type') transactionType: TransactionTypeEnum | any;
  @readonly @date('created_at') createdAt: Date | any;
  @readonly @date('updated_at') updatedAt: Date | any;

  // associations/relationships
  @relation('wallet', 'wallet_id') wallet: any;
  @relation('category', 'category_id') category: any;

  @writer async markAsUnpaid() {
    await this.update(transaction => [(transaction.isPaid = false)]);
  }

  @writer async markAsPaid() {
    await this.update(transaction => [(transaction.isPaid = true)]);
  }
}

export {Transaction};
