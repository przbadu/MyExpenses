import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  children,
  writer,
} from '@nozbe/watermelondb/decorators';

// account types
export interface AccountProps {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDefault?: boolean;
  isArchived?: boolean;
  balanceAmount?: number;
}

class Account extends Model {
  static table = 'accounts';

  // associations
  static associations = {
    transactions: {type: 'has_many', foreign_key: 'account_id'},
  };

  // attributes
  @field('name') name: String | any;
  @field('balance_amount') balanceAmount: Number | any;
  @field('is_default') isDefault: Boolean | any;
  @field('is_archived') isArchived: Boolean | any;
  @readonly @date('created_at') createdAt: Date | any;
  @readonly @date('updated_at') updatedAt: Date | any;

  // relationships
  @children('transactions') transactions: any;

  // quickly mark account as archived
  @writer async markAsArchived() {
    await this.update(account => {
      account.isArchived = true;
    });
  }

  // quickly mark account as de-archive / active
  @writer async markAsActive() {
    await this.update(account => {
      account.isArchived = false;
    });
  }

  // quickly mark account as default
  @writer async markAsDefault() {
    await this.update(account => {
      account.isDefault = true;
    });
  }

  // delete all transactions for account
  async deleteAllTransactions() {
    await this.transactions.destroyAllPermanently();
  }
}

export {Account};
