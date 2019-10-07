import { IBaseRequest, IBaseReply, IBaseMessage, ApiResult } from "../legacyapi/apiinterfaces";
import { IWorkspaceDetails } from "../workspace/workspaceinterfaces";
import { IProcessDetails } from "../process/processinterfaces";
import { IPathDetails } from "./pathinterfaces";

export const PathRequestRoutes = {
  Load: "/api/path/load"
};
export type PathRequestRoutes = keyof typeof PathRequestRoutes;

// Reply: ApiReply
export interface IGetPathRequest extends IBaseRequest {
  path: string;
}

export interface IGetPathReply extends IBaseReply {
  workspace?: IWorkspaceDetails;
  process?: IProcessDetails;

  pathDetails?: IPathDetails; // Falls ein nicht vorhandener Path angefragt wird, sind pathStack und pathDetails = null
}

export const PATHLOADED_MESSAGE = "PathLoadedMessage";
export interface IPathLoadedMessage extends IBaseMessage {
  type: "PathLoadedMessage";
  pathDetails?: IPathDetails;
  error?: ApiResult;  // Nur gesetzt, falls Seitenaufruf gescheitert
}

