import { IWorkspaceDetails } from "../workspace";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { nullId } from "../tools/guid";
import { isTrue } from "../tools/assert";
import { tl } from "../tl";
import { IEscalation, ITodo } from "../phroxapi";

export interface IRoxtraUserDetails {
  HasUserManagementAccess: boolean;
  HasEFormulareEditAccess: boolean;
  HasEFormulareSetCorporateDesignRight: boolean;
  escalations?: IEscalation[];
  todos?: ITodo[];
  ReceiveMails: boolean;
  ReceiveDailyReports: boolean;
  ReceiveWeeklyReports: boolean;
}

export interface IArchiveViews {
  [processId: string]: string;
}

export class UserDetails {
  userId: string;
  mail: string;
  realName?: string;
  displayName?: string; // RealName or mail if no name is defined
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  language?: string; // Preferred User language (en, de, ...)
  extras: {
    // New Extras must be added to cache-handling in useractions -> loadUser!
    workspaces?: IWorkspaceDetails[];
    accessToken?: string;  // Only available in sign in replies
    instances?: IInstanceDetails[];
    viewStates?: IViewStates;
    archiveViews?: IArchiveViews;
    roXtra?: IRoxtraUserDetails;
  };
  accountState?: AccountState;
  isLibraryAdmin?: boolean; // Not available in GraphQL
  lastSeenAt?: Date; // Last time user was online (updated every 12h) / not available in GraphQL
  lastStatusMailAt?: Date;
  noDailyUpdates?: boolean;
  noWeeklyStatus?: boolean;
  alwaysSendMails?: boolean;
  mailSignature?: string;
}
export const gqlUserTypes = `     
  input ViewState {
    lastViewedAt: Date
    isPinned: Boolean
  }

  type UserExtras {
    member: String
  }

  type UserDetails {
    userId: ID!

    # E-mail address 
    mail: String!

    realName: String

    # RealName if available, otherwise mail address
    displayName: String!

    photoUrl: URI

    #Extras are used to request additional user data
    extras: UserExtras
  }
`;

export enum UserExtras {
  None = 0,
  ExtrasWorkspaces = 1 << 0, // Get workspaces where user is a member
  ExtrasWorkspacesWithMembersAndProcesses = 1 << 1,  // The sidebar needs fully loaded workspaces to display
  ExtrasInstances = 1 << 2,  // Instances visible to user
  ExtrasViewStates = 1 << 3,  // User-specific last opening-dates of instances, used to sync notifications on all user devices
  ExtrasArchiveViews = 1 << 4  // User-specific last viewed archive views by process id
}

export const emptyUser: UserDetails = {
  userId: nullId(),
  mail: null,
  realName: null,
  extras: {},
};

export function getUserWorkspace(user: UserDetails, workspaceId: string): IWorkspaceDetails {
  if (user == null)
    return null;

  // ExtrasWorkspaces required
  isTrue(user.extras.workspaces != null, "getUserWorkspace: user.extras.workspaces == null");

  return user.extras.workspaces.find((workspace) => workspace.workspaceId === workspaceId);
}

export enum AccountState {
  // DON'T CHANGE NUMBER VALUES - used in database
  Preregistered = 0, // User invited, mail addres known but not yet registered
  Registered = 1, // User has registered but not yet confirmed mail address
  Confirmed = 2, // Fully registered, mail address confirmed
  Deleted = 3,
  Demo = 4,
  System = 5
}

export const SystemUserId = "-1";

// Erste Gruppendefinitionen - echtes Gruppenmanagement folgt später
export const PredefinedGroups = {
  Public: "10000000060F0001", // Fixe GruppenId für öffentlichen Zugriff
  Everybody: "10000000060E0004", // Jeder (entspricht Public mit anderer Bezeichnung für anderen Einsatzbereich)
  AllWorkspaceMembers: "100000003A500002", // Fixe GruppenId für alle Workspace-Mitglieder
  AllParticipants: "1000000000445003" // Alle Beteiligten am Prozess
};
export type PredefinedGroups = keyof typeof PredefinedGroups;

export function getDefaultRoleGroup(): string {
  return PredefinedGroups.AllWorkspaceMembers;
}

export function isPredefinedGroup(groupId: string): boolean {
  return (groupId === PredefinedGroups.Public
    || groupId === PredefinedGroups.Everybody
    || groupId === PredefinedGroups.AllWorkspaceMembers
    || groupId === PredefinedGroups.AllParticipants);
}

export function getPredefinedGroupName(groupId: string): string {
  switch (groupId) {
    case PredefinedGroups.Public:
      return tl("ProcessHub Community (öffentlich)");
    case PredefinedGroups.Everybody:
      return tl("Jeder (gestattet externe Teilnahme mit Mailadresse)");
    case PredefinedGroups.AllWorkspaceMembers:
      return tl("Alle Mitglieder des Teams");
    case PredefinedGroups.AllParticipants:
      return tl("Nur Prozessbeteiligte Mitglieder des Teams");
  }
}

// Sonderfall weil seltsamerweise undefined wenn es in den Actions ist
export const UserActionsType = {
  LoggedIn: "USERACTION_LOGGEDIN", // Benutzer hat sich erfolgreich angemeldet
  Failed: "USERACTION_FAILED" // Allgemeiner Api-Aufruffehler
};
export type UserActionsType = keyof typeof UserActionsType;

// Tracks last view datetimes of instances and/or processes
// used to sync notification states across devices
export interface IViewState {
  lastViewedAt?: Date;  // Last time instancePopup for this instance was opened
  isPinned?: boolean;  // Instance/process pinned to sidebar?
}
export interface IViewStates {
  [objectId: string]: IViewState;
}