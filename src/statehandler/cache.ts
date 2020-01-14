import { UserDetails } from "../user/userinterfaces";
import { IWorkspaceDetails } from "../workspace/workspaceinterfaces";
import { IProcessDetails } from "../process/processinterfaces";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import _ = require("lodash");
import { Process, Workspace, Instance, User } from "..";

export function mergeUserToCache(user: UserDetails, workspaceState: Workspace.WorkspaceState, processState: Process.ProcessState, userState: User.UserState, instanceState: Instance.InstanceState): UserDetails {
  if (user == null)
    return null;

  // UserState does not have a userCache but we need to merge into currentUser
  const tmpcache: { [userId: string]: UserDetails } = {
    [user.userId]: userState.currentUser
  };
  user = mergeElementToCache(user, tmpcache, "userId");

  // Merge workspaces
  if (user.extras.workspaces) {
    const newList: IWorkspaceDetails[] = [];
    user.extras.workspaces.map(workspace => {
      newList.push(mergeWorkspaceToCache(workspace, workspaceState, processState, instanceState, userState));
    });
    user.extras.workspaces = newList;
  }

  // Merge instances to cache
  if (user.extras.instances) {
    user.extras.instances.map(instance => {
      mergeInstanceToCache(instance, instanceState, userState, processState, true);
    });
  }

  return user;
}

export function mergeWorkspaceToCache(workspace: IWorkspaceDetails, workspaceState: Workspace.WorkspaceState, processState: Process.ProcessState, instanceState: Instance.InstanceState, userState: User.UserState): IWorkspaceDetails {
  if (workspace == null)
    return null;

  // Merge main element
  workspaceState.workspaceCache = workspaceState.workspaceCache || {};
  const result = mergeElementToCache(workspace, workspaceState.workspaceCache, "workspaceId");

  // Merge processes
  if (workspace.extras.processes) {
    const newList: IProcessDetails[] = [];
    workspace.extras.processes.map(process => {
      newList.push(mergeProcessToCache(process, processState, instanceState, userState));
    });
    workspace.extras.processes = newList;
  }

  return result;
}

export function mergeProcessToCache(process: IProcessDetails, processState: Process.ProcessState, instanceState: Instance.InstanceState, userState: User.UserState): IProcessDetails {
  if (process == null)
    return null;

  // Merge main element
  const result = mergeElementToCache(process, processState.processCache, "processId");

  // Merge instances
  if (process.extras.instances) {
    const newList: IInstanceDetails[] = [];
    process.extras.instances.map(instance => {
      newList.push(mergeInstanceToCache(instance, instanceState, userState, processState));
    });
    process.extras.instances = newList;
  }

  return result;
}

export function mergeInstanceToCache(instance: IInstanceDetails, instanceState: Instance.InstanceState, userState: User.UserState, processState: Process.ProcessState, ignoreUser = false): IInstanceDetails {
  if (instance == null)
    return null;

  // Merge main element
  const result = mergeElementToCache(instance, instanceState.instanceCache, "instanceId");

  // Merge back to user.extras.instances
  if (!ignoreUser && userState.currentUser && userState.currentUser.extras.instances) {
    const userInstances = userState.currentUser.extras.instances;
    const element = userInstances.find(ui => ui.instanceId === instance.instanceId);
    if (element) {
      userInstances.splice(userInstances.indexOf(element), 1);
    }
    userInstances.push(result);
  }

  // Merge back to process.extras.instances
  // ONLY, if extras.instances have already been loaded for the process, otherwise load-request might be ignored in archive
  const process = processState.processCache[instance.processId];
  if (process && process.extras.instances
    && process.extras.instances.find(instance2 => instance2.instanceId === instance.instanceId) == null) {
    process.extras.instances.push(instance);
  }

  return result;
}


export function removeInstanceFromCache(instanceId: string, instanceState: Instance.InstanceState, userState: User.UserState, processState: Process.ProcessState): void {

  const instanceCache = instanceState.instanceCache;
  if (instanceCache)
    delete (instanceCache[instanceId]);

  if (instanceState.currentInstance && instanceState.currentInstance.instanceId === instanceId)
    instanceState.currentInstance = null;

  // Also remove from user.extras.instances
  let processId: string;
  if (userState.currentUser && userState.currentUser.extras.instances) {
    const userInstances = userState.currentUser.extras.instances;
    const element = userInstances.find(ui => ui.instanceId === instanceId);
    if (element) {
      processId = element.processId;
      userInstances.splice(userInstances.indexOf(element), 1);
    }
  }

  // Also remove from process.extras.instances
  if (processId) {
    const process = processState.processCache[processId];

    if (process && process.extras.instances) {
      const instance = process.extras.instances.find(instance2 => instance2.instanceId === instanceId);
      process.extras.instances.splice(process.extras.instances.indexOf(instance), 1);
    }
  }
}

// Stores the new elements to cache and merges included extras
export function mergeElementToCache(newElement: any, cacheElements: {[key: string]: any}, idFieldName: string): any {
  const elementId = (newElement)[idFieldName];
  const cacheElement = cacheElements[elementId];

  if (cacheElement == null) {
    // NewElement not in cache
    cacheElements[elementId] = newElement;
    return newElement;
  } else {
    // Merge newElement to cacheElement
    // Step 1: copy all properties except extras to cache
    for (const property in newElement) {
      if (property !== "extras")
        cacheElement[property] = newElement[property];
    }

    // Step 2: remove properties from cacheElement that don't exist in newElement
    for (const property in cacheElement) {
      if (property !== "extras" && newElement[property] == null)
        delete(cacheElement[property]);
    }

    // Step 3: copy extras to cacheElement
    for (const property in newElement.extras) {
      if (property !== "roleOwners") {
        cacheElement.extras[property] = newElement.extras[property];
      } else {
        // Would only update highest level (lane_id etc)
        /* for (let key in newElement.extras["roleOwners"]) {
          cacheElement.extras["roleOwners"][key] = newElement.extras["roleOwners"][key];
        }*/
        // cacheElement.extras["roleOwners"] = mergeDeep(cacheElement.extras["roleOwners"], newElement.extras["roleOwners"]);
        cacheElement.extras["roleOwners"] = _.merge(cacheElement.extras["roleOwners"], newElement.extras["roleOwners"]);
      }
    }
    newElement.extras = cacheElement.extras;

    return cacheElement;
  }
}
