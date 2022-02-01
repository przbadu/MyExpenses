import {database} from '../index';

export class LocalStorage {
  static async get(key: string): Promise<string | null> {
    return await database.adapter.getLocal(key);
  }

  static async set(key: string, value: string): Promise<void> {
    return await database.adapter.setLocal(key, value);
  }

  static async delete(key: string): Promise<void> {
    return await database.adapter.removeLocal(key);
  }
}
