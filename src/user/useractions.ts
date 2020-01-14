import { rootStore } from "../statehandler";
import { Dispatch, Action, AnyAction } from "redux";
import * as StateHandler from "../statehandler";
import * as Api from "../legacyapi";
import { UserDetails, UserExtras } from "./userinterfaces";
import { ILoadUserReply, UserRequestRoutes, IUserLoadedMessage, ILoadUserRequest } from "./legacyapi";
import { UserMessages } from "./phclient";

export function updateUserInState(user: UserDetails): void {
  if (user != null) {
    const message: AnyAction = {
      type: UserMessages.UserLoadedMessage as UserMessages,
      user: user
    };
    const state = rootStore.getState();
    Object.assign(message, state);
    rootStore.dispatch<IUserLoadedMessage>(message);
  }
}

export async function loadUser(userId: string, getExtras: UserExtras = UserExtras.None, forceReload = false, accessToken: string = null): Promise<UserDetails> {
  const userState = StateHandler.rootStore.getState().userState;
  const currentUser = userState ? userState.currentUser : null;

  if (!forceReload && currentUser) {
    if ((getExtras & UserExtras.ExtrasWorkspaces) && currentUser.extras.workspaces)
      getExtras -= UserExtras.ExtrasWorkspaces;
    if ((getExtras & UserExtras.ExtrasArchiveViews) && currentUser.extras.archiveViews) {
      getExtras -= UserExtras.ExtrasArchiveViews;
    }
    if ((getExtras & UserExtras.ExtrasWorkspacesWithMembersAndProcesses)
      && currentUser.extras.workspaces && currentUser.extras.workspaces.length > 0
      && currentUser.extras.workspaces[0].extras.members && currentUser.extras.workspaces[0].extras.processes)
      getExtras -= UserExtras.ExtrasWorkspacesWithMembersAndProcesses;

    if (getExtras === 0) {
      updateUserInState(currentUser);
      return currentUser;
    }
  }
  return (await rootStore.dispatch<any>(loadUserAction(userId, getExtras, accessToken))).userDetails;
}

export function loadUserAction(userId: string, getExtras: UserExtras, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<ILoadUserReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<ILoadUserReply> => {
    const request: ILoadUserRequest = {
      userId: userId,
      getExtras: getExtras
    };
    const response: ILoadUserReply = await Api.postJson(UserRequestRoutes.LoadUser, request);
    if (response.userDetails != null) {
      updateUserInState(response.userDetails);
    }
    return response;
  };
}
