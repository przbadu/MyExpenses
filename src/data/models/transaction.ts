import {writer} from '@nozbe/watermelondb/decorators/action';
import date from '@nozbe/watermelondb/decorators/date';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import relation from '@nozbe/watermelondb/decorators/relation';
import Model, {Associations} from '@nozbe/watermelondb/Model';
import Relation from '@nozbe/watermelondb/Relation';
import {Category, Wallet} from '.';
import {TableName} from '../tableName';

// category enum, we only support income and expense type category for now
export enum TransactionTypeEnum {
  income = 'Income',
  expense = 'Expense',
}

class Transaction extends Model {
  // table name
  static table = TableName.TRANSACTIONS;

  // associations
  static associations: Associations = {
    [TableName.CATEGORIES]: {type: 'belongs_to', key: 'category_id'},
    [TableName.WALLETS]: {type: 'belongs_to', key: 'wallet_id'},
  };

  // attributes
  @date('transaction_at') transactionAt!: Date;
  @field('time') time?: string;
  @field('notes') notes!: string;
  @field('amount') amount!: number;
  @field('is_paid') isPaid?: boolean;
  @field('transaction_type') transactionType!: TransactionTypeEnum;
  @readonly @date('created_at') createdAt?: Date;
  @readonly @date('updated_at') updatedAt?: Date;

  // relationships attributes
  @relation(TableName.WALLETS, 'wallet_id') wallet!: Relation<Wallet>;
  @relation(TableName.CATEGORIES, 'category_id') category!: Relation<Category>;

  @writer async markAsUnpaid() {
    await this.update(transaction => [(transaction.isPaid = false)]);
  }

  @writer async markAsPaid() {
    await this.update(transaction => [(transaction.isPaid = true)]);
  }
}

export default Transaction;
