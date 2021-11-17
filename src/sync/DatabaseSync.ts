export interface DatabaseSync {
  upload(): Promise<void>;
  download(): Promise<void>;
  hasSynced(): Promise<boolean>;
  hasRemoteUpdate(): Promise<boolean>;
  hasLastUploadCompleted(): Promise<boolean>;
}
