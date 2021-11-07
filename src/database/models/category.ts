import children from '@nozbe/watermelondb/decorators/children';
import date from '@nozbe/watermelondb/decorators/date';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import Model from '@nozbe/watermelondb/Model';
import {TransactionProps} from '.';

// category types
export interface CategoryProps {
  id?: number | string;
  createdAt?: Date;
  name: string;
  color?: string;
  icon?: string;
  transactions?: TransactionProps[];
}

class Category extends Model {
  static table = 'categories';

  // has_many associations
  static associations = {
    transactions: {type: 'has_many', foreignkey: 'category_id'},
  };

  // attributes
  @field('name') name: string | any;
  @field('color') color: string | any;
  @field('icon') icon: string | any;
  @readonly @date('created_at') createdAt: Date | any;
  @readonly @date('updated_at') updatedAt: Date | any;

  //  relationships
  @children('transactions') transactions: any;

  // delete all dependent transactions for category
  async deleteAllTransactions() {
    await this.transactions.destroyAllPermanently();
  }
}

export {Category};
