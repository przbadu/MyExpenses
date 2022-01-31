export type FileMetadataType = {
  id: string;
  name: string;
  modifiedTime: string;
  version: string;
  kind?: string;
  mimeType?: string;
  size?: number;
  createdTime?: string;
  trashed: boolean;
};
