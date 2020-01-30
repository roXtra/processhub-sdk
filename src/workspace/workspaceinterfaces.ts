import { IProcessDetails } from "../process/processinterfaces";
import { UserDetails } from "../user/userinterfaces";
import { IAuditTrailEntry } from "../audittrail";
import { IGroupDetails } from "../group/groupinterfaces";

export interface IWorkspaceDetails {
  workspaceId: string;
  urlName?: string; // DisplayName converted to Uri segment
  fullUrl?: string; // @urlname
  displayName: string;
  description?: string;
  userRole?: WorkspaceRole;  // Rolle des angemeldeten Users im Workspace
  trialExpiresAt?: Date;
  licensedUsers?: number;
  colors?: IWorkspaceColor[];
  mailboxAddress?: string; // If defined mailbox is defined in settings
  extras: {
    // New Extras must be added to cache-handling in workspaceactions -> loadWorkspace!
    members?: IWorkspaceMember[];
    processes?: IProcessDetails[];  // Only processes that the current user may access
    settings?: IWorkspaceSettings;
    tags?: string[]; // All available tags in the workspace
    auditTrail?: IAuditTrailEntry[];
    groups?: IGroupDetails[];
  };
}

export enum WorkspaceExtras {
  None = 0,
  ExtrasMembers = 1 << 0,
  ExtrasProcesses = 1 << 1,
  ExtrasSettings = 1 << 2,
  ExtrasTags = 1 << 3,
  ExtrasAuditTrail = 1 << 4,
  ExtrasGroups = 1 << 5,
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
  userDetails: UserDetails;
  memberRole: WorkspaceRole;
}

export interface IWorkspaceColor {
  color: string;
  title: string;
}