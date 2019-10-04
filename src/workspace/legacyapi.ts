import { IBaseRequest, IBaseMessage } from "../legacyapi/apiinterfaces";
import { WorkspaceExtras, IWorkspaceDetails, WorkspaceRole, WorkspaceType } from "./workspaceinterfaces";
import { WorkspaceMessages } from "./phclient";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
  CreateWorkspace: "/api/workspace/create",
  InviteWorkspaceMember: "/api/workspace/invitemember",
  RemoveWorkspaceMember: "/api/workspace/removemember",
  UpdateWorkspace: "/api/workspace/update",
  DeleteWorkspace: "/api/workspace/delete",
  SetMemberRole: "/api/workspace/setmemberrole",
  StartTrial: "/api/workspace/starttrial",
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
export interface IWorkspaceCreatedMessage extends IBaseMessage {
  type: WorkspaceMessages;
  workspace?: IWorkspaceDetails;
}

export interface ICreateWorkspaceRequest extends IBaseRequest {
  workspace: IWorkspaceDetails;
}

export type TrialUserCountType = "10" | "25" | "50" | "100" | "100+";
export interface IStartTrialRequest extends IBaseRequest {
  workspaceId: string;
  name: string;
  mail: string;
  company: string;
  phone: string;
  testType: WorkspaceType;
  userCount: TrialUserCountType;
}

export interface IUpdateWorkspaceRequest extends IBaseRequest {
  workspace: IWorkspaceDetails;
}

export interface IDeleteWorkspaceRequest extends IBaseRequest {
  workspaceId: string;
}

export interface IInviteWorkspaceMemberRequest extends IBaseRequest {
  workspaceId: string;
  userIdOrUserMail: string[];
  memberRole: WorkspaceRole;
  invitationMessage: string; // Nachricht im Markdown-Format
}

export interface IRemoveWorkspaceMemberRequest extends IBaseRequest {
  workspaceId: string;
  userId: string;
}

export interface ISetMemberRoleRequest extends IBaseRequest {
  workspaceId: string;
  userId: string;
  memberRole: WorkspaceRole;
}
