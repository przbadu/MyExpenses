import Model from '@nozbe/watermelondb/Model';
import field from '@nozbe/watermelondb/decorators/field';

export interface SettingProps {
  id?: number | string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  systemAppLock: boolean;
}

class Setting extends Model {
  static table = 'settings';

  // fields
  @field('currency') currency: string | undefined;
  @field('date_format') dateFormat: string | undefined;
  @field('time_format') timeFormat: string | undefined;
  @field('system_app_lock') systemAppLock: string | undefined;
}

export {Setting};
