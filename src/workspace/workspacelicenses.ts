import { IWorkspaceDetails, WorkspaceType } from "./workspaceinterfaces";

export function licenseHasGroups(workspace: IWorkspaceDetails): boolean {
  return licenseIsBusinessOrHigher(workspace);
}

export function licenseHasProcessVisibility(workspace: IWorkspaceDetails): boolean {
  return licenseIsBusinessOrHigher(workspace);
}

// Does license include modeler?
export function licenseHasModeler(workspace: IWorkspaceDetails): boolean {
  return licenseIsDemoOrHigher(workspace);
}

// Does license include PotentialRoleOwners?
export function licenseHasPotentialRoleOwners(workspace: IWorkspaceDetails): boolean {
  return licenseIsDemoOrHigher(workspace);
}

// Does license define managers and owners per process?
export function licenseHasManagersAndOwners(workspace: IWorkspaceDetails): boolean {
  return licenseIsBusinessOrHigher(workspace);
}

// Does license allow to select who can see instances?
export function licenseHasInstanceVisibility(workspace: IWorkspaceDetails): boolean {
  return licenseIsTeamOrHigher(workspace);
}

// Does license allow to select members as admins?
export function licenseHasWorkspaceAdmins(workspace: IWorkspaceDetails): boolean {
  return licenseIsTeamOrHigher(workspace);
}
// Does license allow to select members as process managers?
export function licenseHasWorkspaceProcessManagers(workspace: IWorkspaceDetails): boolean {
  // Seems too complicated
  return false;
}


export function licenseIsFree(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType === WorkspaceType.Free;
}
export function licenseIsTrial(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.trialExpiresAt && workspace.workspaceType !== WorkspaceType.Demo && workspace.workspaceType !== WorkspaceType.Free;
}
export function licenseIsDemo(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType === WorkspaceType.Demo;
}
export function licenseIsDemoOrHigher(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType >= WorkspaceType.Demo;
}

export function licenseIsTeam(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType === WorkspaceType.Team;
}
export function licenseIsTeamOrHigher(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType >= WorkspaceType.Team;
}

export function licenseIsBusiness(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType === WorkspaceType.Business;
}
export function licenseIsBusinessOrHigher(workspace: IWorkspaceDetails): boolean {
  return workspace && workspace.workspaceType >= WorkspaceType.Business;
}
