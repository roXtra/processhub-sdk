export const PREVIEW_FILENAME = "preview.svg";

export interface IFileStore {

  getFile(workspaceId: string, processId: string, fileName: string): Promise<string>;
  getFileBuffer(workspaceId: string, processId: string, fileName: string): Promise<Buffer>;

  getAttachmentFileUrl(workspaceId: string, processId: string, fileName: string): string;
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

  getLastModifiedDate(key: string): Promise<Date>;

  getPhysicalPath(key: string): string;
}