import * as PH from "../";
import * as _ from "lodash";

// Helper functions to detect if notification symbols should be displayed in dashboard

// latest activity (todo/comment created) - shown in dashboard cards
export function latestActivityAt(instance: PH.Instance.IInstanceDetails): Date {
  if (!instance)
    return null;

  let latestAt = instance.latestCommentAt;
  if (latestAt == null)
    latestAt = instance.createdAt;

  if (instance.extras.todos) {
    instance.extras.todos.map(todo => {
      if (latestAt == null || todo.createdAt > latestAt)
        latestAt = todo.createdAt;
    });
  }

  return latestAt;
}

export function instanceHasBeenViewed(instanceEnv: PH.IInstanceEnvironment, actionHandler: PH.ActionHandler): void {
  if (!instanceEnv || !instanceEnv.instance || !instanceEnv.user)
    return;

  if (instanceEnv.user.extras.viewStates == null)
    instanceEnv.user.extras.viewStates = {};  // Initialize

  const oldViewState = _.cloneDeep(instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId]);

  // We cannot use client date, this might differ from server
  // set the date to the newest value of
  // - latestCommentAt
  // - createdAt of all todos for the instance (the todo might be newer than the latest comment!)

  const newDate = latestActivityAt(instanceEnv.instance);

  if (instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] == null)
    instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] = {};

  instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId].lastViewedAt = newDate;

  // ActionHandler causes rerender - only call if viewState was changed
  if (!_.isEqual(oldViewState, instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId])) {
    // TODO
    // ActionHandler.updateViewState(instanceEnv.instance.instanceId, instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId]);
  }
}

export function instanceLastViewedAt(instanceEnv: PH.IInstanceEnvironment): Date {
  if (!instanceEnv || !instanceEnv.instance || !instanceEnv.user)
    return null;

  if (instanceEnv.user == null || instanceEnv.user.extras.viewStates == null)
    return null;

  if (instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] == null)
    return null;

  return instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId].lastViewedAt;
}

export function hasInstanceComments(instanceEnv: PH.IInstanceEnvironment): boolean {
  if (!instanceEnv || !instanceEnv.instance || !instanceEnv.user)
    return null;

  return (instanceEnv.instance.latestCommentAt != null);
}

// True if there are a) new comments and b) user is a roleOwner - otherwise there should be no notification symbol
export function notifyNewInstanceComments(instanceEnv: PH.IInstanceEnvironment): boolean {
  if (!instanceEnv || !instanceEnv.instance || !instanceEnv.user)
    return false;

  // Is user RoleOwner?
  if (!instanceEnv.user || !PH.Instance.isRoleOwner(instanceEnv.user.userId, null, instanceEnv.instance))
    return false;

  if (instanceEnv.instance.latestCommentAt == null)
    return false;

  const lastViewedAt = instanceLastViewedAt(instanceEnv);
  if (lastViewedAt == null)
    return true;  // LatestCommentAt != null, so there are new comments

  return (instanceEnv.instance.latestCommentAt > lastViewedAt);
}

// True if a todo for the current user has been created since last viewing the instance
export function notifyNewInstanceTodos(instanceEnv: PH.IInstanceEnvironment): boolean {
  if (!instanceEnv || !instanceEnv.instance || !instanceEnv.user)
    return false;

  if (!instanceEnv.instance.extras.todos)
    return false;

  // Detect the date of the latest todo for the user
  let latestAt: Date = null;
  instanceEnv.instance.extras.todos.map(todo => {
    if (todo.userId === instanceEnv.user.userId && (latestAt == null || todo.createdAt > latestAt))
      latestAt = todo.createdAt;
  });
  if (latestAt == null)
    return false;  // No todos for user

  const lastViewedAt = instanceLastViewedAt(instanceEnv);
  if (lastViewedAt == null)
    return true;  // LatestCommentAt != null, so there are new comments

  return (latestAt > lastViewedAt);
}

// True if user owns a todo that is pinned
export function notifyInstancePin(instanceEnv: PH.IInstanceEnvironment): boolean {
  if (!instanceEnv || !instanceEnv.instance || !instanceEnv.user)
    return false;

  if (!instanceEnv.instance.extras.todos)
    return false;

  let pinned = false;
  instanceEnv.instance.extras.todos.map(todo => {
    if (todo.userId === instanceEnv.user.userId && todo.isPinned)
      pinned = true;
  });

  return pinned;
}