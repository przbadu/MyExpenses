import {GoogleSignin} from 'react-native-google-signin';
import {
  GDrive,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import dayjs, {Dayjs} from 'dayjs';

import {LocalStorage} from '../../database/helpers';
import {GOOGLE_DRIVE} from './GoogleDriveConstants';
import {DatabaseSync} from '../DatabaseSync';

export class GoogleDriveSync implements DatabaseSync {
  // True when a backup is already in progress
  private backupIsCurrentlyInProgress = false;
  private localDBFilePath = '/data/data/com.przbadu.myexpense/watermelon.db';
  private backupDbName = 'myexpenses.db';
  private gdrive: GDrive = new GDrive();

  async init(): Promise<void> {
    let token = await GoogleSignin.getTokens();
    if (!token) {
      alert('Cannot perform backup without and access Token');
    }
    this.gdrive.accessToken = token.accessToken;
  }

  // Creates a copy of the database file and kicks off the backup process.
  // Promise is resolved once COPY is complete.
  // Backup to google drive will occur in the background later on.
  async upload(): Promise<void> {
    await this.init();

    // If a backup is already in progress, this will currently be a no-op
    if (this.backupIsCurrentlyInProgress === true) {
      alert('[Dropbox backup] backup already in progress!');
      return;
    }

    this.backupIsCurrentlyInProgress = true;

    // Record that a backup has started
    await LocalStorage.set(
      GOOGLE_DRIVE.LAST_UPDATE_STATUS_KEY,
      GOOGLE_DRIVE.UPDATE_STATUS_STARTED,
    );

    // Create a copy of the DB first to the backup file
    await this.copyDBToBackupFile();

    // The copy is complete, so we'll end the Promise chain here.
    // Kick off the remote backup to Dropbox.
    await this.performBackup();
    this.backupIsCurrentlyInProgress = false;
    console.log('[Dropbox backup] BACKUP COMPLETE.');
    return;
  }

  download(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  hasSynced(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  hasRemoteUpdate(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  hasLastUploadCompleted(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // TODO: check this to fix permission issue: https://github.com/itinance/react-native-fs/issues/677
  // this method handles the logic to keep backup file to download folder
  async copyDBToBackupFile(): Promise<void> {
    const databaseBackupFilePath = this.getLocalDBBackupFilePath();
    try {
      const statResult = await RNFS.stat(databaseBackupFilePath);

      if (statResult) {
        console.log('RNFS statResult if:', statResult);
        // There is a file here already! Delete it.
        await RNFS.unlink(databaseBackupFilePath);
        console.log(
          'Unlinked ' + databaseBackupFilePath + ' now copying backup file',
        );
        await RNFS.copyFile(this.localDBFilePath, databaseBackupFilePath);
      } else {
        console.log('RNFS statResult else:', statResult);
        await RNFS.copyFile(this.localDBFilePath, databaseBackupFilePath);
      }
    } catch (error: any) {
      // there is no such file, lets backup our file, this is good
      await RNFS.copyFile(this.localDBFilePath, databaseBackupFilePath);
    }
  }

  // this method handles the logic to upload backup file to google drive
  async performBackup(): Promise<void> {
    try {
      const mimeType = 'application/x-sqlite3';
      const fileToBackup = RNFS.readFile(this.localDBFilePath, 'base64');
      const fileMetadata = {
        name: 'myexpenses.db',
        MimeTypes: mimeType,
      };

      const result = await this.gdrive.files
        .newMultipartUploader()
        .setData(fileToBackup, mimeType)
        .setRequestBody(fileMetadata)
        .execute();

      console.log('file uploaded to Drive: ', result.id);
    } catch (error: any) {
      alert('Error: ' + error.message);
    }

    console.log('last line!!');

    // TODO: get uploaded timestamp from server and update it in localstorage
  }

  private getLocalDBBackupFilePath(): string {
    return `${RNFS.DownloadDirectoryPath}/${this.backupDbName}`;
  }
}
