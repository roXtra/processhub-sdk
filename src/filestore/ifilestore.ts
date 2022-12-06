export const PREVIEW_FILENAME = "preview.svg";

export interface IFileStore {
  getFile(workspaceId: string, processId: string, fileName: string): Promise<string | undefined>;
  getFileBuffer(workspaceId: string, processId: string, fileName: string): Promise<Buffer>;

  /**
   * Returns the attachment file url
   * @param workspaceId Workspace ID
   * @param processId Process ID
   * @param fileName File name without trailing slash. A trailing slash from the filename will be removed. The file name must be URI Component encoded.
   * @param relativeUrl if true the returned URL does not have the backend URL as a prefix.
   */
  getAttachmentFileUrl(workspaceId: string, processId: string, fileName: string, relativeUrl?: boolean): string;
  getPreviewFileUrl(workspaceId: string, processId: string): string;

  createFile(workspaceId: string, processId: string, fileName: string, fileContent: string | Buffer, acl: "private" | "public-read"): Promise<boolean>;
  createPreviewFile(workspaceId: string, processId: string, fileContent: string): Promise<boolean>;
  createProfilePicture(userId: string, fileContent: Buffer): Promise<string>;

  deleteFile(key: string): Promise<boolean>;
  deleteProcessFile(workspaceId: string, processId: string, fileName: string): Promise<boolean>;

  deleteProcessFolder(workspaceId: string, processId: string): Promise<boolean>;
  deleteWorkspaceFolder(workspaceId: string): Promise<boolean>;

  listObjects(key: string): Promise<string[]>;
  exists(key: string): Promise<boolean>;

  getLastModifiedDate(key: string): Promise<Date | undefined>;

  getPhysicalPath(key: string): string;
}
