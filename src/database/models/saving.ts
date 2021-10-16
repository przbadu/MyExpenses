import {Model} from '@nozbe/watermelondb';
import {writer} from '@nozbe/watermelondb/decorators/action';
import date from '@nozbe/watermelondb/decorators/date';
import field from '@nozbe/watermelondb/decorators/field';
import readonly from '@nozbe/watermelondb/decorators/readonly';

export interface SavingProps {
  id?: string;
  title: string;
  requiredAmount: number;
  targetAmount: number;
  fulfilled: boolean;
  onHold: boolean;
}

class Saving extends Model {
  // table name
  static table = 'savings';

  // attributes
  @field('title') title: string | any;
  @field('required_amount') requiredAmount: number | any;
  @field('target_amount') targetAmount: number | any;
  @field('fulfilled') fulfilled: boolean | any;
  @field('onhold') onhold: boolean | any;
  @readonly @date('created_at') createdAt: Date | any;
  @readonly @date('updated_at') updatedAt: Date | any;

  @writer async markAsHold() {
    await this.update(saving => [(saving.onhold = true)]);
  }

  @writer async markAsUnhold() {
    await this.update(saving => [(saving.onhold = false)]);
  }

  @writer async markAsFulfilled() {
    await this.update(saving => [(saving.fulfilled = true)]);
  }
}

export {Saving};
