import * as _ from "lodash";
import update from "immutability-helper";
import * as StateHandler from "../statehandler";
import { WorkspaceState, WorkspaceMessages } from "./phclient";
import { IWorkspaceLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { ResetStore } from "../statehandler/actions";
import { AnyAction } from "redux";

export function workspaceReducer(workspaceState: WorkspaceState, action: AnyAction): WorkspaceState {

  if (workspaceState == null || action && action.type === ResetStore) {
    // Init state
    workspaceState = new WorkspaceState();
    workspaceState.workspaceCache = {};
  }
  if (action == null || action.type === ResetStore)
    return workspaceState;

  switch (action.type) {
    case WorkspaceMessages.WorkspaceLoadedMessage: {
      workspaceState.currentWorkspace = StateHandler.mergeWorkspaceToCache((action as IWorkspaceLoadedMessage).workspace, workspaceState, action.processState, action.instanceState);

      const workspaceChanged = !_.isEqual(workspaceState.currentWorkspace, workspaceState.lastDispatchedWorkspace);
      workspaceState.lastDispatchedWorkspace = _.cloneDeep(workspaceState.currentWorkspace);

      // React cannot detect state changes in objects. Updating cacheState triggers rendering
      // -> only render if data has changed
      if (workspaceChanged) {
        return update(workspaceState, {
          cacheState: { $set: createId() }
        });
      } else {
        return workspaceState;
      }
    }
    default:
      // State not changed
      return workspaceState;
  }
}
