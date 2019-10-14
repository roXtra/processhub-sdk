import * as PH from "../";
import _ = require("lodash");
import { updateUserInState } from "../user/useractions";
import { IUpdateViewStateRequest, UserRequestRoutes } from "../user";
import { postJson } from "../legacyapi";

// Helper functions to detect if notification symbols should be displayed in dashboard

export function notifyNewInstanceComments(processEnv: PH.IProcessEnvironment): boolean {
  const instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);
  let notify = false;

  instances.map(instance => {
    if (instance.extras.todos && instance.extras.todos.length > 0) {  // No todos = no dashboard entry
      const instanceEnv: PH.IInstanceEnvironment = { instance: instance, ...processEnv };
      if (PH.Instance.notifyNewInstanceComments(instanceEnv))
        notify = true;
    }
  });

  return notify;
}

export function processHasBeenViewed(processEnv: PH.IProcessEnvironment, actionHandler: PH.ActionHandler): void {
  if (!processEnv || !processEnv.process || !processEnv.user) {
    return;
  }

  if (processEnv.user.extras.viewStates == null) {
    processEnv.user.extras.viewStates = {};  // Initialize
  }

  const oldViewState = _.cloneDeep(processEnv.user.extras.viewStates[processEnv.process.processId]);

  const newDate = processEnv.process.latestCommentAt;

  if (processEnv.user.extras.viewStates[processEnv.process.processId] == null) {
    processEnv.user.extras.viewStates[processEnv.process.processId] = {};
  }

  processEnv.user.extras.viewStates[processEnv.process.processId].lastViewedAt = newDate;

  // Causes rerender - only call if viewState was changed
  if (!_.isEqual(oldViewState, processEnv.user.extras.viewStates[processEnv.process.processId])) {
    updateUserInState(processEnv.user);
    const request: IUpdateViewStateRequest = {
      objectId: processEnv.process.processId,
      viewState: processEnv.user.extras.viewStates[processEnv.process.processId],
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    postJson(UserRequestRoutes.UpdateViewState, request);
  }
}

export function notifyNewProcessComments(processEnv: PH.IProcessEnvironment): boolean {
  if (!processEnv || !processEnv.process || !processEnv.user) {
    return false;
  }

  if (processEnv.process.latestCommentAt == null) {
    return false;
  }

  const lastViewedAt = processLastViewedAt(processEnv);
  if (lastViewedAt == null) {
    return true;  // LatestCommentAt != null, so there are new comments
  }

  return (processEnv.process.latestCommentAt > lastViewedAt);
}

export function processLastViewedAt(processEnv: PH.IProcessEnvironment): Date {
  if (!processEnv || !processEnv.process || !processEnv.user) {
    return null;
  }

  if (processEnv.user.extras.viewStates == null) {
    return null;
  }

  if (processEnv.user.extras.viewStates[processEnv.process.processId] == null) {
    return null;
  }

  return processEnv.user.extras.viewStates[processEnv.process.processId].lastViewedAt;
}

export function notifyNewProcessTodos(processEnv: PH.IProcessEnvironment): boolean {

  const instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);
  let notify = false;

  instances.map(instance => {
    const instanceEnv: PH.IInstanceEnvironment = { instance: instance, ...processEnv };
    if (PH.Instance.notifyNewInstanceTodos(instanceEnv) || PH.Instance.notifyInstancePin(instanceEnv))
      notify = true;
  });

  return notify;
}

// Notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceComments(workspaceEnv: PH.IWorkspaceEnvironment): boolean {

  const instances = PH.Instance.filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);
  let notify = false;

  instances.map(instance => {
    const instanceEnv: PH.IInstanceEnvironment = { instance: instance, process: null, ...workspaceEnv };
    if (PH.Instance.notifyNewInstanceComments(instanceEnv))
      notify = true;
  });

  return notify;
}

// Notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceTodos(workspaceEnv: PH.IWorkspaceEnvironment): boolean {

  const instances = PH.Instance.filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);
  let notify = false;

  instances.map(instance => {
    const instanceEnv: PH.IInstanceEnvironment = { instance: instance, process: null, ...workspaceEnv };
    if (PH.Instance.notifyNewInstanceTodos(instanceEnv))
      notify = true;
  });

  return notify;
}

// Count the number of instances that are currently notifying new todos and/or new comments
export function countNotifyingInstances(processEnv: PH.IProcessEnvironment): number {
  let count = 0;

  const instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);

  instances.map(instance => {
    if (instance.extras.todos && instance.extras.todos.length > 0) {  // No todos = no dashboard entry
      const instanceEnv: PH.IInstanceEnvironment = { instance: instance, ...processEnv };
      if (PH.Instance.notifyNewInstanceComments(instanceEnv) || PH.Instance.notifyNewInstanceTodos(instanceEnv))
        count++;
    }
  });

  return count;
}