import Model from '@nozbe/watermelondb/Model';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import date from '@nozbe/watermelondb/decorators/date';
import children from '@nozbe/watermelondb/decorators/children';

// category types
export interface CategoryProps {
  id?: number | string;
  createdAt?: Date;
  name: string;
  color?: string;
}

class Category extends Model {
  static table = 'categories';

  // has_many associations
  static associations = {
    transactions: {type: 'has_many', foreign_key: 'category_id'},
  };

  // attributes
  @field('name') name: string | any;
  @field('color') color: String | any;
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
