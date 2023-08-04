import { tl } from "../tl";
import { getDefaultRoleGroup, hasEditAccess, IUserDetails, IUserDetailsNoExtras, Licence, PredefinedGroups } from "../user/userinterfaces";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { IWorkspaceDetails, IWorkspaceMember, StateWorkspaceDetails } from "../workspace/workspaceinterfaces";
import { IProcessDetails, ProcessViewAccess } from "./processinterfaces";
import { error } from "../tools/assert";
import { isGroupId, isUserId } from "../tools/guid";
import { Bpmn } from "./bpmn";
import isEqual from "lodash/isEqual";
import { ModuleName } from "../modules/imodule";
import { StateProcessDetails } from "./processstate";
import { StateUserDetails } from "../user/phclient";
import { isWorkspaceMember } from "../workspace/workspacerights";

export enum ProcessAccessRights {
  None = 0,
  EditProcess = 1 << 0,
  ManageProcess = 1 << 1,
  StartProcess = 1 << 2,
  ViewProcess = 1 << 3,
  ViewAllTodos = 1 << 7, // User can see all instances, not only instance with own role
  StartProcessByMail = 1 << 8, // User can start this process by mail
  StartProcessByTimer = 1 << 9, // User can start this process by timer
}

export interface IProcessRoles {
  [roleId: string]: IProcessRole; // RoleId ist RollenId bzw. LaneId des Prozesses
}
export const DefaultRoles = {
  Owner: "OWNER", // DO NOT CHANGE - string used in database
  Manager: "MANAGER", // DO NOT CHANGE - string used in database
  Viewer: "VIEWER", // DO NOT CHANGE - string used in database
  Follower: "FOLLOWER", // DO NOT CHANGE - string used in database
  DashboardViewer: "DASHBOARDVIEWER", // DO NOT CHANGE - string used in database
  AuditTrailViewer: "AUDITTRAILVIEWER", // DO NOT CHANGE - string used in database
};
export type DefaultRoles = keyof typeof DefaultRoles;

export function getDefaultRoleName(roleId: string, language: string, moduleName: ModuleName): string {
  switch (roleId) {
    case DefaultRoles.Owner:
      return tl("Prozesseigner", language, moduleName);
    case DefaultRoles.Manager:
      return tl("Prozessmanager", language, moduleName);
    case DefaultRoles.Viewer:
      return tl("Sichtbarkeit des Prozesses", language, moduleName);
    case DefaultRoles.Follower:
      return tl("Weitere Beteiligte", language, moduleName);
    case DefaultRoles.DashboardViewer:
      return tl("Sichtbarkeit von Vorgängen", language, moduleName);
    case DefaultRoles.AuditTrailViewer:
      return tl("Sichtbarkeit des Audit-Trails", language, moduleName);
    default:
      return roleId;
  }
}

export interface IProcessRole {
  // DO NOT CHANGE MEMBER NAMES - object stored in Db in json-format
  roleName?: string;
  potentialRoleOwners: IRoleOwner[];
  isStartingRole?: boolean; // This role is allowed to start the process
  isStartingByMailRole?: boolean; // This role is allowed to start the process with an incoming mail
  isStartingByTimerRole?: boolean; // This role is allowed to start the process with an timer
  allowMultipleOwners?: boolean; // Role can have multiple simultaneous role owners
}
export interface IPotentialRoleOwners {
  potentialRoleOwner: IRoleOwner[];
}
export interface IRoleOwnerMap {
  [roleId: string]: IRoleOwner[]; // Array, da es später auch mehrere gleichzeitige Rolleninhaber geben könnte
}

export interface IRoleOwner {
  memberId: string; // UserId, GroupId oder Mailadresse
  displayName?: string;
  user?: IUserDetailsNoExtras;
}

export function isDefaultRole(roleId: string): boolean {
  return (
    roleId === DefaultRoles.Manager ||
    roleId === DefaultRoles.Owner ||
    roleId === DefaultRoles.Follower ||
    roleId === DefaultRoles.Viewer ||
    roleId === DefaultRoles.DashboardViewer ||
    roleId === DefaultRoles.AuditTrailViewer
  );
}

export function isDefaultProcessRole(roleId: string): boolean {
  return (
    roleId === DefaultRoles.Manager ||
    roleId === DefaultRoles.Owner ||
    roleId === DefaultRoles.Viewer ||
    roleId === DefaultRoles.DashboardViewer ||
    roleId === DefaultRoles.AuditTrailViewer
  );
}

export function getProcessRoles(
  currentRoles: IProcessRoles | undefined,
  bpmnProcess: BpmnProcess | undefined,
  defaultRoleOwnerId: string,
  dashBoardAccess?: ProcessViewAccess,
): IProcessRoles {
  // Add entries for all existing roles in the process
  const processRoles = currentRoles || {};

  // Everybody can be added as a follower
  processRoles[DefaultRoles.Follower] = { potentialRoleOwners: [{ memberId: getDefaultRoleGroup() }], allowMultipleOwners: true };

  if (bpmnProcess != null) {
    // Set default owners for all roles
    const lanes = bpmnProcess.getLanes(false);
    lanes.map((lane) => {
      if (processRoles[lane.id] == null) {
        processRoles[lane.id] = { potentialRoleOwners: [{ memberId: defaultRoleOwnerId }] };
      }
      processRoles[lane.id].roleName = lane.name;

      // Clean up starting role setting from all lanes, will be added again in next step
      delete processRoles[lane.id].isStartingRole;
      delete processRoles[lane.id].isStartingByMailRole;
      delete processRoles[lane.id].isStartingByTimerRole;
    });

    // Set starting roles
    const startEvents = bpmnProcess.getStartEvents(bpmnProcess.processId());
    startEvents.map((startEvent) => {
      const startEventExtensions = BpmnProcess.getExtensionValues(startEvent);
      const isMailMessageStartEvent: boolean =
        startEvent.eventDefinitions?.find((e) => e.$type === "bpmn:MessageEventDefinition") != null &&
        (startEventExtensions.messageEventType == null || startEventExtensions.messageEventType === "mail");
      const isTimerStartEvent: boolean = startEvent.eventDefinitions?.find((e) => e.$type === "bpmn:TimerEventDefinition") != null;
      const role = bpmnProcess.getLaneOfFlowNode(startEvent.id);
      if (role) {
        // In new processes somehow the start element is not in a lane (yet)
        if (isMailMessageStartEvent) {
          processRoles[role.id].isStartingByMailRole = true;
        } else if (isTimerStartEvent) {
          processRoles[role.id].isStartingByTimerRole = true;
        } else {
          processRoles[role.id].isStartingRole = true;
        }
      }
    });

    // Add anonymous StartEvent user to process role and viewer role
    for (const startEvent of startEvents) {
      const extensions = BpmnProcess.getExtensionValues(startEvent);
      if (extensions.anonymousStart && extensions.anonymousStartUserId) {
        const role = bpmnProcess.getLaneOfFlowNode(startEvent.id);
        if (role) {
          const addToRole = (role: IProcessRole): void => {
            if (role) {
              if (extensions.anonymousStartUserId) {
                if (!role.potentialRoleOwners.find((o) => o.memberId === extensions.anonymousStartUserId)) {
                  role.potentialRoleOwners.push({ memberId: extensions.anonymousStartUserId });
                }
              }
            }
          };
          addToRole(processRoles[role.id]);
          processRoles[DefaultRoles.Viewer] = processRoles[DefaultRoles.Viewer] || { potentialRoleOwners: [{ memberId: defaultRoleOwnerId }] };
          addToRole(processRoles[DefaultRoles.Viewer]);
        }
      }
    }

    // Backwards compatibility for new dashboard access control
    if (!processRoles[DefaultRoles.DashboardViewer] || processRoles[DefaultRoles.DashboardViewer].potentialRoleOwners.length === 0) {
      if (dashBoardAccess === ProcessViewAccess.WorkspaceMembersSeeAll) {
        processRoles[DefaultRoles.DashboardViewer] = { potentialRoleOwners: [{ memberId: PredefinedGroups.AllWorkspaceMembers }] };
      } else {
        processRoles[DefaultRoles.DashboardViewer] = { potentialRoleOwners: [] };
      }
    }

    // Backwards compatibility for new audit trail access control
    if (!processRoles[DefaultRoles.AuditTrailViewer]) {
      processRoles[DefaultRoles.AuditTrailViewer] = { potentialRoleOwners: [{ memberId: PredefinedGroups.AllWorkspaceMembers }] };
    }

    // Remove roles that are not used any more
    for (const role in processRoles) {
      if (
        role !== DefaultRoles.Owner &&
        role !== DefaultRoles.Manager &&
        role !== DefaultRoles.Viewer &&
        role !== DefaultRoles.Follower &&
        role !== DefaultRoles.DashboardViewer &&
        role !== DefaultRoles.AuditTrailViewer
      ) {
        if (lanes.find((lane) => lane.id === role) == null) delete processRoles[role];
      }
    }
  }

  return processRoles;
}

/**
 * Checks if the current user is potential role owner for a given role - use {@link getPotentialRoleOwners} to check other users
 * @param userId id of current user
 * @param roleId id of role to check
 * @param workspace workspace details, must be requested with the context of the current user
 * @param process process details
 * @param ignorePublic should PredefinedGroups.Everybody be ignored
 * @returns {boolean} true if current user is potential role owner, false otherwise
 */
export function isPotentialRoleOwner(
  userId: string,
  roleId: string | undefined,
  workspace: IWorkspaceDetails | StateWorkspaceDetails,
  process: IProcessDetails | StateProcessDetails,
  ignorePublic = false,
): boolean {
  // RoleId == null -> check if user is PotentialRoleOwner of any role
  const roles = process.extras.processRoles;
  if (roles == null) {
    throw new Error("isPotentialRoleOwner called without valid process.extras.processRoles");
  }

  const { groups } = workspace.extras;
  if (!groups) {
    throw new Error("isPotentialRoleOwner called without valid workspace.extras.groups");
  }

  if (roleId == null) {
    // Check if user is PotentialRoleOwner of any role
    for (const role in roles) {
      if (isPotentialRoleOwner(userId, role, workspace, process, ignorePublic) === true) return true;
    }
    return false;
  }

  if (roles[roleId] == null || roles[roleId].potentialRoleOwners == null) return false;

  for (const potentialRoleOwner of roles[roleId].potentialRoleOwners) {
    if (potentialRoleOwner.memberId === userId) {
      // Always accept current roleOwners (process might have been changed, we still want to accept existing owners)
      return true;
    }
    if (!ignorePublic && potentialRoleOwner.memberId === PredefinedGroups.Everybody) {
      return true;
    }
    if (potentialRoleOwner.memberId === PredefinedGroups.AllWorkspaceMembers || (ignorePublic && potentialRoleOwner.memberId === PredefinedGroups.Everybody)) {
      // Check if user is workspace member
      if (isWorkspaceMember(workspace)) {
        return true;
      }
    }
    if (isGroupId(potentialRoleOwner.memberId)) {
      const group = groups.find((g) => g.groupId === potentialRoleOwner.memberId);
      if (group) {
        if (group.memberIds.includes(userId)) {
          return true;
        }
      }
    }
  }

  if (roleId === DefaultRoles.Viewer) {
    if (roles[roleId].potentialRoleOwners.find((potentialRoleOwner) => potentialRoleOwner.memberId === PredefinedGroups.AllParticipants)) {
      // Bei Sichtbarkeit "AllParticipants" oder "Public" muss geprüft werden, ob User in einer der anderen Rollen eingetragen ist
      // Der Fall Public ist nur bei ignorePublic relevant
      for (const role in roles) {
        if (
          role !== DefaultRoles.Viewer &&
          // AllParticipants soll allen Teilnehmern, die eine Rolle im Prozess haben, Lesezugriff gewähren. Allerdings
          // nur den explizit genannten Teilnehmern, nicht der Public-Gruppe, sonst wäre jeder Prozess,
          // bei dem externe Personen teilnehmen dürfen, automatisch Public.
          isPotentialRoleOwner(userId, role, workspace, process, true)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function addIfLicenceAllows(
  owners: IPotentialRoleOwners,
  user: StateUserDetails | IUserDetails | IUserDetailsNoExtras | IWorkspaceMember["userDetails"],
  roleId: string,
): void {
  if (user.licence === Licence.Writer || (roleId === DefaultRoles.Follower && user.licence === Licence.Reader)) {
    owners.potentialRoleOwner.push({
      memberId: user.userId,
      displayName: user.displayName,
    });
  }
}

export function getPotentialRoleOwners(
  workspaceDetails: IWorkspaceDetails | StateWorkspaceDetails,
  processDetails: IProcessDetails | StateProcessDetails,
  roleId?: string,
): { [roleId: string]: IPotentialRoleOwners } {
  const allOwners: { [roleId: string]: IPotentialRoleOwners } = {};

  if (processDetails.extras.processRoles == null) {
    return allOwners;
  }

  for (const role in processDetails.extras.processRoles) {
    if ((roleId == null || role === roleId) && processDetails.extras.processRoles[role]) {
      const owners: IPotentialRoleOwners = {
        potentialRoleOwner: [],
      };
      let addedWsMembers = false;
      for (const potentialOwner of processDetails.extras.processRoles[role].potentialRoleOwners) {
        if ((potentialOwner.memberId === PredefinedGroups.AllWorkspaceMembers || potentialOwner.memberId === PredefinedGroups.Everybody) && !addedWsMembers) {
          // All workspace members are potential owners
          if (workspaceDetails.extras.members) {
            // If someone is not a workspace member he does not have access to the member list, so this list is empty
            for (const member of Object.values(workspaceDetails.extras.members)) {
              addIfLicenceAllows(owners, member.userDetails, role);
            }
            addedWsMembers = true; // Merken, damit Member nicht mehrfach hinzugefügt werden, falls beide Gruppen genannt werden
          }
        } else if (isUserId(potentialOwner.memberId)) {
          owners.potentialRoleOwner.push({
            memberId: potentialOwner.memberId,
            displayName: potentialOwner.displayName,
          });
        } else if (isGroupId(potentialOwner.memberId)) {
          if (workspaceDetails.extras.groups) {
            const group = workspaceDetails.extras.groups.find((g) => g.groupId === potentialOwner.memberId);
            if (group && group.memberIds) {
              for (const memberId of group.memberIds) {
                const member = workspaceDetails.extras.members?.[memberId];
                if (member) {
                  addIfLicenceAllows(owners, member.userDetails, role);
                }
              }
            }
          }
        } else {
          error("invalid call");
        }
      }
      allOwners[role] = owners;
    }
  }
  return allOwners;
}

/**
 * Checks if the current user is process owner
 * @param process process details - must be requested with the context of the current user
 * @param currentUserUser context that requested the details - will give false results for other users!
 * @returns {boolean} true if current user is process owner, false otherwise
 */
export function isProcessOwner(process: IProcessDetails | StateProcessDetails | undefined, currentUser: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  if (process == null || process.userRights == null || !hasEditAccess(currentUser)) return false;

  return (process.userRights & ProcessAccessRights.EditProcess) !== 0;
}

/**
 * Checks if the current user is process manager
 * @param process process details - must be requested with the context of the current user
 * @param currentUserUser context that requested the details - will give false results for other users!
 * @returns {boolean} true if current user is process manager, false otherwise
 */
export function isProcessManager(process: IProcessDetails | StateProcessDetails | undefined, currentUser: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  if (process == null || process.userRights == null || !hasEditAccess(currentUser)) return false;

  // Owner are managers
  return isProcessOwner(process, currentUser) || (process.userRights & ProcessAccessRights.ManageProcess) !== 0;
}

export function canViewProcess(process: IProcessDetails | StateProcessDetails): boolean {
  if (process == null || process.userRights == null) return false;

  return (process.userRights & ProcessAccessRights.ViewProcess) !== 0;
}

/**
 * Checks if the current user can edit the process
 * @param process process details - must be requested with the context of the current user
 * @param currentUserUser context that requested the details - will give false results for other users!
 * @returns {boolean} true if current user can edit the process, false otherwise
 */
export function canEditProcess(process: IProcessDetails | StateProcessDetails, currentUser: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  return isProcessOwner(process, currentUser);
}

export function canSimulateProcess(process: IProcessDetails | StateProcessDetails | undefined, user: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  if (process != null && !process.isNewProcess && hasEditAccess(user)) {
    const bpmnProcess = process.extras.bpmnProcess;
    if (bpmnProcess) {
      const startEvents: Bpmn.IStartEvent[] = bpmnProcess.getStartEvents(bpmnProcess.processId());
      const startEventsWithoutDefinitions: Bpmn.IStartEvent[] = startEvents.filter((e) => e.eventDefinitions == null || e.eventDefinitions.length === 0);
      return startEventsWithoutDefinitions.length > 0;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function canStartProcess(process: IProcessDetails | StateProcessDetails | undefined, startEventId: string | undefined): boolean {
  if (process == null) return false;

  if (startEventId == null) return false;

  if (process.userStartEvents == null || isEqual(process.userStartEvents, {})) {
    return false;
  }

  // If userStartEvent is in map, user is allowed to start process
  return process.userStartEvents[startEventId] != null;
}

export function canStartProcessByMail(process: IProcessDetails | StateProcessDetails | undefined, user: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  if (process == null || process.userRights == null) return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return hasEditAccess(user) && (process.userRights & ProcessAccessRights.StartProcessByMail) !== 0;
}
export function canStartProcessByTimer(process: IProcessDetails | StateProcessDetails | undefined, user: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  if (process == null || process.userRights == null) return false;

  // Only timer in the start lane may start the process - even administrators don't inherit that right!
  return hasEditAccess(user) && (process.userRights & ProcessAccessRights.StartProcessByTimer) !== 0;
}

export function canViewTodos(process: IProcessDetails | StateProcessDetails): boolean {
  if (process == null || process.userRights == null) return false;

  return canViewAllTodos(process) || process.userRights !== 0;
}
export function canViewAllTodos(process: IProcessDetails | StateProcessDetails): boolean {
  if (process == null || process.userRights == null) return false;

  return (process.userRights & ProcessAccessRights.ViewAllTodos) !== 0;
}

export function canViewArchive(process: IProcessDetails | StateProcessDetails): boolean {
  if (process == null || process.userRights == null) return false;

  return process.userRights !== 0;
}

export function canDeleteProcess(process: IProcessDetails | StateProcessDetails, user: StateUserDetails | IUserDetails | IUserDetailsNoExtras): boolean {
  return isProcessOwner(process, user) && !process.isNewProcess;
}
