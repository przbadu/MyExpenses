import {DropboxDatabaseSync} from './dropbox/DropboxDatabaseSync';

export default class SyncAdapter {
  static upload() {
    new DropboxDatabaseSync().upload();
  }

  static download() {
    new DropboxDatabaseSync().download();
  }
}
