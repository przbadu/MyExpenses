import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  children,
  writer,
} from '@nozbe/watermelondb/decorators';

// payment mode types
export interface PaymentModeProps {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDefault?: boolean;
  isArchived?: boolean;
  balanceAmount?: number;
}

class PaymentMode extends Model {
  static table = 'payment_modes';

  // associations
  static associations = {
    transactions: {type: 'has_many', foreign_key: 'payment_mode_id'},
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

  // quickly mark payment mode as archived
  @writer async markAsArchived() {
    await this.update(payment_mode => {
      payment_mode.isArchived = true;
    });
  }

  // quickly mark payment_mode as de-archive / active
  @writer async markAsActive() {
    await this.update(payment_mode => {
      payment_mode.isArchived = false;
    });
  }

  // quickly mark payment_mode as default
  @writer async markAsDefault() {
    await this.update(payment_mode => {
      payment_mode.isDefault = true;
    });
  }

  // delete all transactions for payment_mode
  async deleteAllTransactions() {
    await this.transactions.destroyAllPermanently();
  }
}

export {PaymentMode};
