import { tl } from "../tl";
import { UserDetails } from "../user/userinterfaces";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { IWorkspaceDetails } from "../workspace/workspaceinterfaces";
import { PredefinedGroups, getDefaultRoleGroup } from "../user/index";
import { IProcessDetails } from "./processinterfaces";
import { isWorkspaceMember } from "../workspace/workspacerights";
import { error } from "../tools/assert";
import { isGroupId, isUserId } from "../tools/guid";
import { Bpmn } from "./bpmn";
import { IGroupDetails } from "../group";
import isEqual from "lodash/isEqual";

export enum ProcessAccessRights {
  None = 0,
  EditProcess = 1 << 0,
  ManageProcess = 1 << 1,
  StartProcess = 1 << 2,
  ViewProcess = 1 << 3,
  ViewArchive = 1 << 4,  // Access to archive tab (available for all workspace members)
  ViewTodos = 1 << 6,  // Access to dashboard tab (available for all members and guests)
  ViewAllTodos = 1 << 7,  // User can see all instances, not only instance with own role
  StartProcessByMail = 1 << 8,  // User can start this process by mail
  StartProcessByTimer = 1 << 9  // User can start this process by timer
}

export interface IProcessRoles {
  [roleId: string]: IProcessRole; // RoleId ist RollenId bzw. LaneId des Prozesses
}
export const DefaultRoles = {
  Owner: "OWNER", // DO NOT CHANGE - string used in database
  Manager: "MANAGER", // DO NOT CHANGE - string used in database
  Viewer: "VIEWER", // DO NOT CHANGE - string used in database
  Follower: "FOLLOWER" // DO NOT CHANGE - string used in database
};
export type DefaultRoles = keyof typeof DefaultRoles;

export function getDefaultRoleName(roleId: string): string {
  switch (roleId) {
    case DefaultRoles.Owner:
      return tl("Prozesseigner");
    case DefaultRoles.Manager:
      return tl("Prozessmanager");
    case DefaultRoles.Viewer:
      return tl("Sichtbarkeit");
    case DefaultRoles.Follower:
      return tl("Weitere Beteiligte");
  }
}

export interface IProcessRole {
  // DO NOT CHANGE MEMBER NAMES - object stored in Db in json-format
  roleName?: string;
  potentialRoleOwners: IRoleOwner[];
  isStartingRole?: boolean;  // This role is allowed to start the process
  isStartingByMailRole?: boolean;  // This role is allowed to start the process with an incoming mail
  isStartingByTimerRole?: boolean;  // This role is allowed to start the process with an timer
  allowMultipleOwners?: boolean;  // Role can have multiple simultaneous role owners
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
  user?: UserDetails;
}

export function isDefaultRole(roleId: string): boolean {
  return (roleId === DefaultRoles.Manager
    || roleId === DefaultRoles.Owner
    || roleId === DefaultRoles.Follower
    || roleId === DefaultRoles.Viewer);
}

export function isDefaultProcessRole(roleId: string): boolean {
  return (roleId === DefaultRoles.Manager
    || roleId === DefaultRoles.Owner
    || roleId === DefaultRoles.Viewer);
}

export function getProcessRoles(currentRoles: IProcessRoles, bpmnProcess: BpmnProcess, workspace: IWorkspaceDetails): IProcessRoles {
  // Add entries for all existing roles in the process
  let processRoles = currentRoles;
  if (processRoles == null)
    processRoles = {};

  // Everybody can be added as a follower
  processRoles[DefaultRoles.Follower] = { potentialRoleOwners: [{ memberId: getDefaultRoleGroup() }], allowMultipleOwners: true };

  if (bpmnProcess != null) {
    // Set default owners for all roles
    const lanes = bpmnProcess.getLanes(false);
    lanes.map(lane => {
      if (processRoles[lane.id] == null) {
        processRoles[lane.id] = { potentialRoleOwners: [{ memberId: getDefaultRoleGroup() }] };
      }
      processRoles[lane.id].roleName = lane.name;

      // Clean up starting role setting from all lanes, will be added again in next step
      delete (processRoles[lane.id].isStartingRole);
      delete (processRoles[lane.id].isStartingByMailRole);
      delete (processRoles[lane.id].isStartingByTimerRole);
    });

    // Set starting roles
    const startEvents = bpmnProcess.getStartEvents(bpmnProcess.processId());
    startEvents.map(startEvent => {
      const isMessageStartEvent: boolean = startEvent.eventDefinitions != null && startEvent.eventDefinitions.find(e => e.$type === "bpmn:MessageEventDefinition") != null;
      const isTimerStartEvent: boolean = startEvent.eventDefinitions != null && startEvent.eventDefinitions.find(e => e.$type === "bpmn:TimerEventDefinition") != null;
      const role = bpmnProcess.getLaneOfFlowNode(startEvent.id);
      if (role) { // In new processes somehow the start element is not in a lane (yet)
        if (isMessageStartEvent) {
          processRoles[role.id].isStartingByMailRole = true;
        } else if (isTimerStartEvent) {
          processRoles[role.id].isStartingByTimerRole = true;
        } else {
          processRoles[role.id].isStartingRole = true;
        }
      }
    });

    // Remove roles that are not used any more
    for (const role in processRoles) {
      if (role !== DefaultRoles.Owner && role !== DefaultRoles.Manager && role !== DefaultRoles.Viewer && role !== DefaultRoles.Follower) {
        if (lanes.find(lane => lane.id === role) == null)
          delete (processRoles[role]);
      }
    }
  }

  return processRoles;
}

export function isPotentialRoleOwner(user: UserDetails, roleId: string, workspace: IWorkspaceDetails, process: IProcessDetails, ignorePublic = false): boolean {
  // User == null -> check if guest is PotentialRoleOwner
  // roleId == null -> check if user is PotentialRoleOwner of any role
  const roles = process.extras.processRoles;
  if (roles == null) {
    console.error("isPotentialRoleOwner called without valid process.extras.processRoles");
    return false;
  }

  const { groups } = workspace.extras;
  if (!groups) {
    console.error("isPotentialRoleOwner called without valid workspace.extras.groups");
    return false;
  }

  if (roleId == null) {
    // Check if user is PotentialRoleOwner of any role
    for (const role in roles) {
      if (isPotentialRoleOwner(user, role, workspace, process, ignorePublic) === true)
        return true;
    }
    return false;
  }

  if (roles[roleId] == null || roles[roleId].potentialRoleOwners == null)
    return false;

  for (const member of roles[roleId].potentialRoleOwners) {
    if (user && member.memberId === user.userId) {
      // Always accept current roleOwners (process might have been changed, we still want to accept existing owners)
      return true;
    }
    if (!ignorePublic && (member.memberId === PredefinedGroups.Public
      || member.memberId === PredefinedGroups.Everybody)) {
      return true;
    }
    if (member.memberId === PredefinedGroups.AllWorkspaceMembers ||
      (ignorePublic && (member.memberId === PredefinedGroups.Public || member.memberId === PredefinedGroups.Everybody))) {
      if (isWorkspaceMember(workspace))
        return true;
    }
    if (user && isGroupId(member.memberId)) {
      const group: IGroupDetails = groups.find(g => g.groupId === member.memberId);
      if (group) {
        if (group.members.find(gm => gm.userId === user.userId) != null) {
          return true;
        }
      }
    }
  }

  if (roleId === DefaultRoles.Viewer) {
    if (roles[roleId].potentialRoleOwners.find(potentialRoleOwner => potentialRoleOwner.memberId === PredefinedGroups.AllParticipants)
      || roles[roleId].potentialRoleOwners.find(potentialRoleOwner => potentialRoleOwner.memberId === PredefinedGroups.Public)) {
      // Bei Sichtbarkeit "AllParticipants" oder "Public" muss geprüft werden, ob User in einer der anderen Rollen eingetragen ist
      // Der Fall Public ist nur bei ignorePublic relevant
      for (const role in roles) {
        if (role !== DefaultRoles.Viewer
          // AllParticipants soll allen Teilnehmern, die eine Rolle im Prozess haben, Lesezugriff gewähren. Allerdings
          // nur den explizit genannten Teilnehmern, nicht der Public-Gruppe, sonst wäre jeder Prozess,
          // bei dem externe Personen teilnehmen dürfen, automatisch Public.
          && isPotentialRoleOwner(user, role, workspace, process, true)) {
          return true;
        }
      }
    }
  }

  return false;
}

function addIfLicenseAllows(owners: IPotentialRoleOwners, user: UserDetails): void {
  if (user.extras.roXtra.HasEFormulareEditAccess) {
    owners.potentialRoleOwner.push({
      memberId: user.userId,
      displayName: user.displayName
    });
  }
}

export function getPotentialRoleOwners(IWorkspaceDetails: IWorkspaceDetails, processDetails: IProcessDetails, roleId: string = null): { [roleId: string]: IPotentialRoleOwners } {
  const allOwners: { [roleId: string]: IPotentialRoleOwners } = {};

  if (processDetails.extras.processRoles == null) {
    return allOwners;
  }

  for (const role in processDetails.extras.processRoles) {
    if ((roleId == null || role === roleId) && processDetails.extras.processRoles[role]) {
      const owners: IPotentialRoleOwners = {
        potentialRoleOwner: []
      };
      let addedWsMembers = false;
      for (const potentialOwner of processDetails.extras.processRoles[role].potentialRoleOwners) {
        if ((potentialOwner.memberId === PredefinedGroups.AllWorkspaceMembers
          || potentialOwner.memberId === PredefinedGroups.Everybody)
          && !addedWsMembers) {
          // All workspace members are potential owners
          if (IWorkspaceDetails.extras.members) {
            // If someone is not a workspace member he does not have access to the member list, so this list is empty
            for (const member of IWorkspaceDetails.extras.members) {
              addIfLicenseAllows(owners, member.userDetails);
            }
            addedWsMembers = true; // Merken, damit Member nicht mehrfach hinzugefügt werden, falls beide Gruppen genannt werden
          }
        } else if (isUserId(potentialOwner.memberId)) {
          owners.potentialRoleOwner.push({
            memberId: potentialOwner.memberId,
            displayName: potentialOwner.displayName
          });
        } else if (isGroupId(potentialOwner.memberId)) {
          if (IWorkspaceDetails.extras.groups) {
            const group: IGroupDetails = IWorkspaceDetails.extras.groups.find(g => g.groupId === potentialOwner.memberId);
            if (group && group.members) {
              for (const member of group.members) {
                addIfLicenseAllows(owners, member);
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

export function processIsPublic(process: IProcessDetails): boolean {
  if (process.extras.processRoles)
    return (process.extras.processRoles[DefaultRoles.Viewer].potentialRoleOwners[0].memberId === PredefinedGroups.Public);

  else
    return false;
}

export function isProcessOwner(process: IProcessDetails): boolean {
  if (process == null || !process.hasUserEFormulareEditAccess)
    return false;

  return ((process.userRights & ProcessAccessRights.EditProcess) !== 0);
}

export function isProcessManager(process: IProcessDetails): boolean {
  if (process == null || !process.hasUserEFormulareEditAccess)
    return false;

  // Owner are managers
  return isProcessOwner(process) || ((process.userRights & ProcessAccessRights.ManageProcess) !== 0);
}

export function canViewProcess(process: IProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewProcess) !== 0);
}

export function canEditProcess(process: IProcessDetails): boolean {
  return isProcessOwner(process);
}

export function canSimulateProcess(process: IProcessDetails): boolean {
  if (process != null && !process.isNewProcess && process.hasUserEFormulareEditAccess) {
    const bpmnProcess: BpmnProcess = process.extras.bpmnProcess;
    if (bpmnProcess) {
      const startEvents: Bpmn.IStartEvent[] = bpmnProcess.getStartEvents(bpmnProcess.processId());
      const startEventsWithoutDefinitions: Bpmn.IStartEvent[] = startEvents.filter(e => e.eventDefinitions == null || e.eventDefinitions.length === 0);
      return startEventsWithoutDefinitions.length > 0;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function canStartProcess(process: IProcessDetails, startEventId: string): boolean {
  if (process == null)
    return false;

  if (startEventId == null)
    return false;

  if (process.userStartEvents == null || isEqual(process.userStartEvents, {}))
    return canStartProcessOld(process);

  // If userStartEvent is in map, user is allowed to start process
  return process.userStartEvents[startEventId] != null;
}
export function canStartProcessOld(process: IProcessDetails): boolean {
  if (process == null || !process.hasUserEFormulareEditAccess)
    return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return ((process.userRights & ProcessAccessRights.StartProcess) !== 0);
}
export function canStartProcessByMail(process: IProcessDetails): boolean {
  if (process == null)
    return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return (process.hasUserEFormulareEditAccess && (process.userRights & ProcessAccessRights.StartProcessByMail) !== 0);
}
export function canStartProcessByTimer(process: IProcessDetails): boolean {
  if (process == null)
    return false;

  // Only timer in the start lane may start the process - even administrators don't inherit that right!
  return (process.hasUserEFormulareEditAccess && (process.userRights & ProcessAccessRights.StartProcessByTimer) !== 0);
}

export function canViewTodos(process: IProcessDetails): boolean {
  if (process == null)
    return false;

  return canViewAllTodos(process) || ((process.userRights & ProcessAccessRights.ViewTodos) !== 0);
}
export function canViewAllTodos(process: IProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewAllTodos) !== 0);
}

export function canViewArchive(process: IProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewArchive) !== 0);
}

export function canDeleteProcess(process: IProcessDetails): boolean {
  return isProcessOwner(process) && !process.isNewProcess;
}