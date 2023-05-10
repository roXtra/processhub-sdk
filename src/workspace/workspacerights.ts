import { IWorkspaceDetails, StateWorkspaceDetails, WorkspaceRole } from "./workspaceinterfaces";

export interface IWorkspaceRole {
  roleName?: string;
  rights?: {
    id: string;
  }[];
}

export interface IWorkspaceRoles {
  [roleId: string]: IWorkspaceRole; // Role id is the lane id of the process
}

export function isWorkspaceMember(workspace: IWorkspaceDetails | StateWorkspaceDetails): boolean {
  if (workspace == null) return false;

  return workspace.userRole != null && workspace.userRole !== WorkspaceRole.None;
}

export function isWorkspaceAdmin(workspace: IWorkspaceDetails | StateWorkspaceDetails): boolean {
  if (workspace == null || workspace.userRole == null) return false;

  return (workspace.userRole & WorkspaceRole.WorkspaceAdmin) !== 0;
}

// Only true if flag is set AND licenseHasWorkspaceProcessManagers()
export function isWorkspaceProcessManager(workspace: IWorkspaceDetails): boolean {
  if (workspace == null || workspace.userRole == null) return false;

  return (workspace.userRole & (WorkspaceRole.WorkspaceAdmin | WorkspaceRole.WorkspaceProcessManager)) !== 0;
}

// Access control in code should NOT use the roles above but instead the following can...-checks

export function canEditWorkspace(workspace: IWorkspaceDetails): boolean {
  return isWorkspaceAdmin(workspace);
}

export function canViewMembers(workspace: IWorkspaceDetails): boolean {
  return isWorkspaceMember(workspace);
}

export function canCreateProcess(workspace: IWorkspaceDetails | StateWorkspaceDetails): boolean {
  return isWorkspaceAdmin(workspace);
}
