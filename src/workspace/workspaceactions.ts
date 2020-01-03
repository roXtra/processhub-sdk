import * as StateHandler from "../statehandler";
import * as Api from "../legacyapi";
import { Dispatch, Action } from "redux";
import { WorkspaceExtras, IWorkspaceDetails } from "./workspaceinterfaces";
import { ILoadWorkspaceReply, ILoadWorkspaceRequest, WorkspaceRequestRoutes } from "./legacyapi";
import { WorkspaceMessages } from "./phclient";
import { Workspace, Process, Instance } from "..";

export async function requireWorkspaceMembers(): Promise<void> {
  // Fordert die Workspace-Members an, falls diese in PathState.currentWorkspace noch nicht enthalten sind.
  const workspaceState = StateHandler.rootStore.getState().workspaceState;
  if (workspaceState.currentWorkspace != null
    && workspaceState.currentWorkspace.extras.members != null) {
    // Members wurden bereits geladen
    return;
  } else if (workspaceState.currentWorkspace != null)
    await loadWorkspace(workspaceState.currentWorkspace.workspaceId, WorkspaceExtras.ExtrasMembers);
}

export async function loadWorkspace(workspaceId: string, getExtras: WorkspaceExtras, forceReload = false, accessToken: string = null): Promise<IWorkspaceDetails> {
  const workspaceState = StateHandler.rootStore.getState().workspaceState;
  let cachedWorkspace = null;

  if (!forceReload && workspaceState.workspaceCache)
    cachedWorkspace = workspaceState.workspaceCache[workspaceId];
  if (cachedWorkspace != null) {
    // Ignore call if all data
    if ((getExtras & WorkspaceExtras.ExtrasMembers) && cachedWorkspace.extras.members)
      getExtras -= WorkspaceExtras.ExtrasMembers;
    if ((getExtras & WorkspaceExtras.ExtrasProcesses) && cachedWorkspace.extras.processes)
      getExtras -= WorkspaceExtras.ExtrasProcesses;
    if ((getExtras & WorkspaceExtras.ExtrasTags) && cachedWorkspace.extras.tags)
      getExtras -= WorkspaceExtras.ExtrasTags;
    if ((getExtras & WorkspaceExtras.ExtrasAuditTrail) && cachedWorkspace.extras.auditTrail)
      getExtras -= WorkspaceExtras.ExtrasAuditTrail;
    if ((getExtras & WorkspaceExtras.ExtrasGroups) && cachedWorkspace.extras.groups)
      getExtras -= WorkspaceExtras.ExtrasGroups;

    if (getExtras === 0) {
      // All data available from cache
      StateHandler.rootStore.dispatch({
        type: WorkspaceMessages.WorkspaceLoadedMessage,
        workspace: cachedWorkspace
      } as ILoadWorkspaceReply);

      return cachedWorkspace;
    }
  }

  return (await StateHandler.rootStore.dispatch<any>(loadWorkspaceAction(workspaceId, workspaceState, StateHandler.rootStore.getState().processState, StateHandler.rootStore.getState().instanceState, getExtras, accessToken))).workspace;
}
export function loadWorkspaceAction(workspaceId: string, workspaceState: Workspace.WorkspaceState, processState: Process.ProcessState, instanceState: Instance.InstanceState, getExtras: WorkspaceExtras, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<ILoadWorkspaceReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<ILoadWorkspaceReply> => {
    const request: ILoadWorkspaceRequest = {
      workspaceId: workspaceId,
      getExtras: getExtras
    };
    const response = await Api.getJson(WorkspaceRequestRoutes.LoadWorkspace, request, accessToken) as ILoadWorkspaceReply;
    if (response.workspace)
      response.workspace = StateHandler.mergeWorkspaceToCache(response.workspace, workspaceState, processState, instanceState);

    dispatch<any>(response);
    return response;
  };
}