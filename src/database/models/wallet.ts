import Model from '@nozbe/watermelondb/Model';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import date from '@nozbe/watermelondb/decorators/date';
import children from '@nozbe/watermelondb/decorators/children';
import {writer} from '@nozbe/watermelondb/decorators/action';

// wallet props
export interface WalletProps {
  id?: string | number;
  name: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDefault?: boolean;
  isArchived?: boolean;
  balanceAmount?: number;
}

class Wallet extends Model {
  static table = 'wallets';

  // associations
  static associations = {
    transactions: {type: 'has_many', foreign_key: 'wallet_id'},
  };

  // attributes
  @field('name') name: String | any;
  @field('color') color: String | any;
  @field('balance_amount') balanceAmount: Number | any;
  @field('is_default') isDefault: Boolean | any;
  @field('is_archived') isArchived: Boolean | any;
  @readonly @date('created_at') createdAt: Date | any;
  @readonly @date('updated_at') updatedAt: Date | any;

  // relationships
  @children('transactions') transactions: any;

  // quickly mark wallet as archived
  @writer async markAsArchived() {
    await this.update(wallet => {
      wallet.isArchived = true;
    });
  }

  // quickly mark wallet as de-archive / active
  @writer async markAsActive() {
    await this.update(wallet => {
      wallet.isArchived = false;
    });
  }

  // quickly mark wallet as default
  @writer async markAsDefault() {
    await this.update(wallet => {
      wallet.isDefault = true;
    });
  }

  // delete all transactions for wallet
  async deleteAllTransactions() {
    await this.transactions.destroyAllPermanently();
  }
}

export {Wallet};
