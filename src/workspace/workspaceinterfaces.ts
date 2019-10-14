import { IProcessDetails } from "../process/processinterfaces";
import { UserDetails } from "../user/userinterfaces";
import { tl } from "../tl";
import { IAuditTrailEntry } from "../audittrail";
import { IGroupDetails } from "../group/groupinterfaces";

// WorkspaceType
export enum WorkspaceType {
  Free = 100,
  Demo = 120, // Demo has some features that Free does not have, e.g. graphical modeler
  Team = 200,
  Business = 300,
  Templates = 310, // Used internally for templates. Processes in this workspace are always public
  Enterprise = 400
}
export function getWorkspaceTypeName(workspaceType: WorkspaceType): string {
  switch (workspaceType) {
    case WorkspaceType.Demo:
      return tl("Demo");
    case WorkspaceType.Free:
      return tl("Free");
    case WorkspaceType.Team:
      return tl("Team");
    case WorkspaceType.Business:
      return tl("Business");
    case WorkspaceType.Enterprise:
      return tl("Enterprise");
    default:
      return workspaceType.toString();
  }
}

export interface IWorkspaceDetails {
  // Changes must also be reflected in gqlTypes and gqlFragments below!

  workspaceId: string;
  workspaceType: WorkspaceType;
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

export const gqlWorkspaceTypes = `     
  type IWorkspaceDetails {
    workspaceId: String!
    workspaceType: String
    urlName: String
    fullUrl: String
    displayName: String
    description: String
    userRole: Int
    extras: ExtrasWorkspace
  }
  type ExtrasWorkspace {
    members: [WorkspaceMember]
    processes: [IProcessDetails]
  }

  scalar WorkspaceMember
`;

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