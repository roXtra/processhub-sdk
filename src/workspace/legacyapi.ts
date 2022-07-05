import { IBaseRequest, IBaseReply } from "../legacyapi/apiinterfaces";
import { WorkspaceExtras, IWorkspaceDetails } from "./workspaceinterfaces";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
};
export type WorkspaceRequestRoutes = keyof typeof WorkspaceRequestRoutes;

export interface ILoadWorkspaceRequest extends IBaseRequest {
  workspaceId: string;
  getExtras: WorkspaceExtras;
}
export interface ILoadWorkspaceReply extends IBaseReply {
  workspace?: IWorkspaceDetails;
}
