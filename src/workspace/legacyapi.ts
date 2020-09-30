import { IBaseRequest, IBaseMessage } from "../legacyapi/apiinterfaces";
import { WorkspaceExtras, IWorkspaceDetails } from "./workspaceinterfaces";
import { WorkspaceMessages } from "./phclient";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
};
export type WorkspaceRequestRoutes = keyof typeof WorkspaceRequestRoutes;

export interface ILoadWorkspaceRequest extends IBaseRequest {
  workspaceId: string;
  getExtras: WorkspaceExtras;
}
export interface ILoadWorkspaceReply extends IBaseMessage {
  type: WorkspaceMessages;
  workspace?: IWorkspaceDetails;
}

export interface IWorkspaceLoadedMessage extends IBaseMessage {
  type: WorkspaceMessages;
  workspace?: IWorkspaceDetails;
}
