import { IBaseRequest, IBaseReply } from "../legacyapi/apiinterfaces";
import { WorkspaceExtras, IWorkspaceDetails } from "./workspaceinterfaces";
import { IWorkspaceRoles } from "./workspacerights";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
  UpdateRoles: "/api/workspace/updateroles",
};
export type WorkspaceRequestRoutes = keyof typeof WorkspaceRequestRoutes;

export interface ILoadWorkspaceRequest extends IBaseRequest {
  workspaceId: string;
  getExtras: WorkspaceExtras;
}
export interface ILoadWorkspaceReply extends IBaseReply {
  workspace?: IWorkspaceDetails;
}
export interface IUpdateWorkspaceRolesRequest extends IBaseRequest {
  workspaceId: string;
  workspaceRoles: IWorkspaceRoles;
}
export interface IUpdateWorkspaceRolesReply extends IBaseReply {
  workspace?: IWorkspaceDetails;
}

export enum RequestedWorkspaceReportType {
  /**
   * Represents a regular workspace report request
   */
  WORKSPACE_REGULAR = 1,
  /**
   * Represents an workspace audit trail report request
   */
  AUDIT_TRAIL = 6,
} 