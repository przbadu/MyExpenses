import {GoogleSignin} from 'react-native-google-signin';
import {
  GDrive,
  MimeTypes,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import dayjs, {Dayjs} from 'dayjs';

import {LocalStorage} from '../../database/helpers';
import {GOOGLE_DRIVE} from './GoogleDriveConstants';
import {DatabaseSync} from '../DatabaseSync';
import {FileMetadataType} from './types';

export class GoogleDriveSync implements DatabaseSync {
  // True when a backup is already in progress
  private backupIsCurrentlyInProgress = false;
  private localDBFilePath = '/data/data/com.przbadu.myexpense/watermelon.db';
  private backupDbName = GOOGLE_DRIVE.FILE_NAME_IDENTIFIER + '-myexpenses.db';
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
    await this.uploadToDrive();
    this.backupIsCurrentlyInProgress = false;
    console.log('[Dropbox backup] BACKUP COMPLETE.');
    // Record that a backup has completed
    await LocalStorage.set(
      GOOGLE_DRIVE.LAST_UPDATE_STATUS_KEY,
      GOOGLE_DRIVE.UPDATE_STATUS_FINISHED,
    );
    return;
  }

  async download(): Promise<void> {
    await this.init();
    console.log(await this.hasRemoteUpdate());
  }

  hasSynced(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async hasRemoteUpdate(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        console.log(
          "[Drive backup] no internet connection; can't check for update",
        );
        return false;
      }
      let lastLocalBackupTimestamp: Dayjs;
      let lastDriveBackupTimestamp: Dayjs;

      const file = await this.getFileMetadata();
      if (file) {
        lastDriveBackupTimestamp = dayjs(file.modifiedTime);

        const localUpdatedTimestampStr = await LocalStorage.get(
          GOOGLE_DRIVE.MOST_RECENT_BACKUP_TIMESTAMP_KEY,
        );
        if (localUpdatedTimestampStr) {
          lastLocalBackupTimestamp = dayjs(localUpdatedTimestampStr);
          const isBefore = lastLocalBackupTimestamp.isBefore(
            lastDriveBackupTimestamp,
          );
          console.log('[Drive backup] isBefore:', isBefore);
          return isBefore;
        }
        console.log('[Drive backup] no local storage time available:');
        return true;
      } else {
        console.log('[Drive backup] no file found');
        return false;
      }
    } catch (e) {
      console.log('[Drive backup] hasRemoteUpdate Error:', e);
      return false;
    }
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
  async uploadToDrive(): Promise<void> {
    let file;
    try {
      const fileToUpload = await RNFS.readFile(
        this.getLocalDBBackupFilePath(),
        'base64',
      );
      file = await this.getFileMetadata();
      console.log(file);

      // upload new file or update existing file
      const uploader = this.gdrive.files
        .newMultipartUploader()
        .setData(fileToUpload, MimeTypes.BINARY)
        .setIsBase64(true)
        // .setQueryParameters({keepRevisionForever: true}) // not sure if we need to do this
        .setRequestBody({
          name: this.backupDbName,
          MimeTypes: MimeTypes.BINARY,
        });
      if (file.id) uploader.setIdOfFileToUpdate(file.id);
      await uploader.execute();
      this.updateLastUpdatedTimestamp(file.id);
    } catch (error: any) {
      if (file) this.updateLastUpdatedTimestamp(file.id);
      console.log('Error: please try again ' + error);
    }
  }

  private getLocalDBBackupFilePath(): string {
    return `${RNFS.DownloadDirectoryPath}/${this.backupDbName}`;
  }

  // update local file metadata
  private async updateLastUpdatedTimestamp(fileId: string): Promise<void> {
    const file = await this.getFileMetadataById(fileId);
    if (file)
      await LocalStorage.set(
        GOOGLE_DRIVE.MOST_RECENT_BACKUP_TIMESTAMP_KEY,
        file.modifiedTime,
      );
  }

  // fetch file metadata using file id
  private async getFileMetadataById(fileId: string): Promise<FileMetadataType> {
    return await this.gdrive.files.getMetadata(fileId, {
      fields: [
        'id',
        'name',
        'kind',
        'version',
        'size',
        'modifiedTime',
        'createdTime',
        'trashed',
      ],
    });
  }

  // if file id present, fetch file metadata using file id
  // otherwise search for file using file name
  private async getFileMetadata(): Promise<FileMetadataType> {
    const result = await this.gdrive.files.list({
      q: new ListQueryBuilder()
        .e('name', this.backupDbName)
        .and()
        .e('trashed', false)
        .and()
        .in('root', 'parents'),
    });
    if (result?.files?.length) {
      return this.getFileMetadataById(result.files[0]?.id);
    }

    return result;
  }
}
