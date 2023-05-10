import { IProcessDetails } from "../process/processinterfaces";
import { IUserDetailsSmall, Licence } from "../user/userinterfaces";
import { IGroupDetails } from "../group/groupinterfaces";
import { IAuditTrailEntry } from "../audittrail/audittrailinterfaces";
import { IWorkspaceRoles } from "./workspacerights";

export type StateWorkspaceExtras = Omit<IWorkspaceDetails["extras"], "processes" | "archivedProcesses">;
export type StateWorkspaceDetails = Omit<IWorkspaceDetails, "extras" | "type"> & {
  type: "state";
  extras: StateWorkspaceExtras;
};

export interface IWorkspaceDetails {
  workspaceId: string;
  displayName: string;
  description?: string;
  userRole?: WorkspaceRole; // Rolle des angemeldeten Users im Workspace
  trialExpiresAt?: Date;
  licensedUsers?: number;
  colors?: IWorkspaceColor[];
  mailboxAddress?: string; // If defined mailbox is defined in settings
  extras: {
    // New Extras must be added to cache-handling in workspaceactions -> loadWorkspace!
    members?: IWorkspaceMember[];
    processes?: IProcessDetails[]; // Only processes that the current user may access (no archived processes)
    archivedProcesses?: IProcessDetails[]; // Processes that are archived
    settings?: IWorkspaceSettings;
    tags?: string[]; // All available tags in the workspace
    auditTrail?: IAuditTrailEntry[];
    groups?: IGroupDetails[];
    workspaceRoles?: IWorkspaceRoles; // Will be set for the internal workflows workspace
  };
  type: "backend";
}

export enum WorkspaceExtras {
  None = 0,
  ExtrasMembers = 1 << 0,
  ExtrasProcesses = 1 << 1,
  ExtrasSettings = 1 << 2,
  ExtrasTags = 1 << 3,
  ExtrasAuditTrail = 1 << 4,
  ExtrasGroups = 1 << 5,
  ExtrasProcessesArchive = 1 << 6,
}

export interface IWorkspaceSettings {
  mailSignature?: string;
}

export enum WorkspaceRole {
  None = 0, // Used to list todos from workspaces where user is not a member
  WorkspaceAdmin = 1 << 0,
  WorkspaceProcessManager = 1 << 1,
  WorkspaceMember = 1 << 2, // Regular member
}

export interface IWorkspaceMember {
  userDetails: IUserDetailsSmall & { licence: Licence };
  memberRole: WorkspaceRole;
}

export interface IWorkspaceColor {
  color: string;
  title: string;
}
