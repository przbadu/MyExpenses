import {writer} from '@nozbe/watermelondb/decorators/action';
import children from '@nozbe/watermelondb/decorators/children';
import date from '@nozbe/watermelondb/decorators/date';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import Model, {Associations} from '@nozbe/watermelondb/Model';
import Query from '@nozbe/watermelondb/Query';

import {Transaction} from '.';
import {TableName} from '../tableName';

class Wallet extends Model {
  static table = TableName.WALLETS;

  // associations
  static associations: Associations = {
    [TableName.TRANSACTIONS]: {
      type: 'has_many',
      foreignKey: 'wallet_id',
    },
  };

  // attributes
  @field('name') name!: string;
  @field('color') color!: string;
  @field('icon') icon!: string;
  @field('balance_amount') balanceAmount!: number;
  @field('is_default') isDefault?: boolean;
  @field('is_archived') isArchived?: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // relationships
  @children(TableName.TRANSACTIONS) transactions?: Query<Transaction>;

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
}

export default Wallet;
