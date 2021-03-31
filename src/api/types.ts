export enum ErrorCodes {
  NO_ERROR,
  AUTHENTICATION_FAILED,
  LOST_CONNECTION,
  SERVER_ERROR,
  TOKEN_INVALID,
  HTTP_ERROR,
}

export interface IToken {
  LoginToken: string;
  UserId?: number;
  ErrorID?: number;
}

export interface IAttachment {
  type: "file" | "item";
  name: string;
  url?: string;
  isInline?: boolean;
  itemId?: string;
}

export interface IItem {
  process: string;
  processID: string;
  workspaceID: string;
}
