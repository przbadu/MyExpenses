import {Model} from '@nozbe/watermelondb';
import {field, readonly, date, children} from '@nozbe/watermelondb/decorators';

// category types
export interface CategoryProps {
  createdAt?: Date;
  name: string;
}

class Category extends Model {
  static table = 'categories';

  // has_many associations
  static associations = {
    transactions: {type: 'has_many', foreign_key: 'category_id'},
  };

  // attributes
  @field('name') name: string | any;
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
