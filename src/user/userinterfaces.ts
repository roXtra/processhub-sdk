import { IWorkspaceDetails } from "../workspace";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { nullId } from "../tools/guid";
import { isTrue } from "../tools/assert";
import { tl } from "../tl";

export enum Licence {
  None = "none",
  Writer = "roXtra.Writer",
  Reader = "roXtra.Reader",
  PublicReader = "roXtra.PublicReader",
}

export function hasEditAccess(user: IUserDetails): boolean {
  return user.licence === Licence.Writer || user.isSystemUser === true;
}

export type ExtendedRight = "Z1";

export function hasSetCorporateDesignRight(user: IUserDetails): boolean {
  if (user.isSystemUser) {
    return true;
  }
  return user.extendedRights && user.extendedRights.includes("Z1");
}

export interface IRoxtraUserDetails {
  ReceiveMails: boolean;
  ReceiveDailyReports: boolean | undefined;
  ReceiveWeeklyReports: boolean | undefined;
}

export interface IArchiveViews {
  [processId: string]: string | undefined;
}

export interface IUserDetails {
  userId: string;
  mail: string;
  displayName: string; // RealName or mail if no name is defined
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  language?: string; // Preferred User language (de-DE, en-US, ...)
  licence: Licence;
  extendedRights: ExtendedRight[];
  isSystemUser?: boolean;
  extras: {
    // New Extras must be added to cache-handling in useractions -> loadUser!
    workspaces?: IWorkspaceDetails[];
    accessToken?: string; // Only available in sign in replies
    instances?: IInstanceDetails[];
    viewStates?: IViewStates;
    archiveViews?: IArchiveViews;
    roXtra?: IRoxtraUserDetails;
  };
  lastSeenAt?: Date; // Last time user was online (updated every 12h) / not available in GraphQL
  lastStatusMailAt?: Date;
  noDailyUpdates?: boolean;
  noWeeklyStatus?: boolean;
  alwaysSendMails?: boolean;
  mailSignature?: string;
}

export enum UserExtras {
  None = 0,
  ExtrasWorkspaces = 1 << 0, // Get workspaces where user is a member
  ExtrasWorkspacesWithProcesses = 1 << 1, // The sidebar needs fully loaded workspaces to display
  ExtrasInstances = 1 << 2, // Instances visible to user
  ExtrasViewStates = 1 << 3, // User-specific last opening-dates of instances, used to sync notifications on all user devices
  ExtrasArchiveViews = 1 << 4, // User-specific last viewed archive views by process id,
}

export const emptyUser: IUserDetails = {
  userId: nullId(),
  mail: "",
  displayName: "",
  extras: {},
  licence: Licence.None,
  language: "de-DE",
  extendedRights: [],
};

export function getUserWorkspace(user: IUserDetails, workspaceId: string): IWorkspaceDetails | undefined {
  if (user == null) {
    return undefined;
  }

  // ExtrasWorkspaces required
  isTrue(user.extras.workspaces != null, "getUserWorkspace: user.extras.workspaces == null");
  if (user.extras.workspaces) {
    return user.extras.workspaces.find((workspace) => workspace.workspaceId === workspaceId);
  } else {
    return undefined;
  }
}

export const SystemUserId = "-1";

export const PredefinedGroups = {
  Everybody: "10000000060E0004", // Jeder (entspricht Public mit anderer Bezeichnung für anderen Einsatzbereich)
  AllWorkspaceMembers: "100000003A500002", // Fixe GruppenId für alle Workspace-Mitglieder
  AllParticipants: "1000000000445003", // Alle Beteiligten am Prozess
};
export type PredefinedGroups = keyof typeof PredefinedGroups;

export function getDefaultRoleGroup(): string {
  return PredefinedGroups.AllWorkspaceMembers;
}

export function isPredefinedGroup(groupId: string): boolean {
  return groupId === PredefinedGroups.Everybody || groupId === PredefinedGroups.AllWorkspaceMembers || groupId === PredefinedGroups.AllParticipants;
}

export function getPredefinedGroupName(groupId: string): string {
  switch (groupId) {
    case PredefinedGroups.Everybody:
      return tl("Jeder (gestattet externe Teilnahme mit Mailadresse)");
    case PredefinedGroups.AllWorkspaceMembers:
      return tl("Alle Mitglieder des Bereichs");
    case PredefinedGroups.AllParticipants:
      return tl("Nur Prozessbeteiligte Mitglieder des Bereichs");
    default:
      return groupId;
  }
}

// Tracks last view datetimes of instances and/or processes
// used to sync notification states across devices
export interface IViewState {
  lastViewedAt?: Date; // Last time instancePopup for this instance was opened
}
export interface IViewStates {
  [objectId: string]: IViewState;
}
