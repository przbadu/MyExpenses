import date from '@nozbe/watermelondb/decorators/date';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import Model from '@nozbe/watermelondb/Model';

export interface SavingAmountProps {
  id?: string;
  amount: number;
}

class SavingAmount extends Model {
  // table name
  static table = 'saving_amounts';

  // attributes
  @field('amount') amount: number | any;
  @readonly @date('created_at') createdAt: Date | any;
}

export {SavingAmount};
