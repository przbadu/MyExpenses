import children from '@nozbe/watermelondb/decorators/children';
import date from '@nozbe/watermelondb/decorators/date';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';
import Model, {Associations} from '@nozbe/watermelondb/Model';
import Query from '@nozbe/watermelondb/Query';
import {Transaction} from '.';
import {TableName} from '../tableName';

class Category extends Model {
  static table = TableName.CATEGORIES;

  // has_many associations
  static associations: Associations = {
    [TableName.TRANSACTIONS]: {type: 'has_many', foreignKey: 'category_id'},
  };

  // attributes
  @field('name') name!: string;
  @field('color') color!: string;
  @field('icon') icon!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  //  relationships
  @children(TableName.TRANSACTIONS) transactions?: Query<Transaction>;
}

export {Category};
