import { rootStore } from "./rootstore";
import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { ProcessDetails } from "../process/processinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import _ = require("lodash");

export function mergeUserToCache(user: UserDetails): UserDetails {
  if (user == null)
    return null;

  // UserState does not have a userCache but we need to merge into currentUser
  const tmpcache: { [userId: string]: UserDetails } = {
    [user.userId]: rootStore.getState().userState.currentUser
  };
  user = mergeElementToCache(user, tmpcache, "userId");

  // Merge workspaces
  if (user.extras.workspaces) {
    const newList: WorkspaceDetails[] = [];
    user.extras.workspaces.map(workspace => {
      newList.push(mergeWorkspaceToCache(workspace));
    });
    user.extras.workspaces = newList;
  }

  // Merge instances to cache
  if (user.extras.instances) {
    user.extras.instances.map(instance => {
      mergeInstanceToCache(instance, true);
    });
  }

  rootStore.getState().userState.currentUser = user;

  return user;
}

export function mergeWorkspaceToCache(workspace: WorkspaceDetails): WorkspaceDetails {
  if (workspace == null)
    return null;

  // Merge main element
  const result = mergeElementToCache(workspace, rootStore.getState().workspaceState.workspaceCache, "workspaceId");

  // Merge processes
  if (workspace.extras.processes) {
    const newList: ProcessDetails[] = [];
    workspace.extras.processes.map(process => {
      newList.push(mergeProcessToCache(process));
    });
    workspace.extras.processes = newList;
  }

  return result;
}

export function mergeProcessToCache(process: ProcessDetails): ProcessDetails {
  if (process == null)
    return null;

  // Merge main element
  const result = mergeElementToCache(process, rootStore.getState().processState.processCache, "processId");

  // Merge instances
  if (process.extras.instances) {
    const newList: InstanceDetails[] = [];
    process.extras.instances.map(instance => {
      newList.push(mergeInstanceToCache(instance));
    });
    process.extras.instances = newList;
  }

  return result;
}

export function mergeInstanceToCache(instance: InstanceDetails, ignoreUser = false): InstanceDetails {
  if (instance == null)
    return null;

  // Merge main element
  const result = mergeElementToCache(instance, rootStore.getState().instanceState.instanceCache, "instanceId");

  // Merge back to user.extras.instances
  if (!ignoreUser && rootStore.getState().userState.currentUser && rootStore.getState().userState.currentUser.extras.instances) {
    const userInstances = rootStore.getState().userState.currentUser.extras.instances;
    const element = userInstances.find(ui => ui.instanceId === instance.instanceId);
    if (element) {
      userInstances.splice(userInstances.indexOf(element), 1);
    }
    userInstances.push(result);
  }

  // Merge back to process.extras.instances
  // ONLY, if extras.instances have already been loaded for the process, otherwise load-request might be ignored in archive
  const process = rootStore.getState().processState.processCache[instance.processId];
  if (process && process.extras.instances
    && process.extras.instances.find(instance2 => instance2.instanceId === instance.instanceId) == null) {
    process.extras.instances.push(instance);
  }

  return result;
}


export function removeInstanceFromCache(instanceId: string): void {

  const instanceCache = rootStore.getState().instanceState.instanceCache;
  if (instanceCache)
    delete (instanceCache[instanceId]);

  if (rootStore.getState().instanceState.currentInstance && rootStore.getState().instanceState.currentInstance.instanceId === instanceId)
    rootStore.getState().instanceState.currentInstance = null;

  // Also remove from user.extras.instances
  let processId: string;
  if (rootStore.getState().userState.currentUser && rootStore.getState().userState.currentUser.extras.instances) {
    const userInstances = rootStore.getState().userState.currentUser.extras.instances;
    const element = userInstances.find(ui => ui.instanceId === instanceId);
    if (element) {
      processId = element.processId;
      userInstances.splice(userInstances.indexOf(element), 1);
    }
  }

  // Also remove from process.extras.instances
  if (processId) {
    const process = rootStore.getState().processState.processCache[processId];

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
