import { rootStore } from "../statehandler";
import { Dispatch, Action, AnyAction } from "redux";
import * as StateHandler from "../statehandler";
import * as Api from "../legacyapi";
import { UserDetails, UserExtras } from "./userinterfaces";
import { ILoadUserReply, IUpdateUserReply, UserRequestRoutes, IUpdateUserRequest, IUpdatePasswordReply, IUpdatePasswordRequest, IUserLoadedMessage, ILoginReply, ILoginRequest, ILoadUserRequest, IUploadProfilePictureRequest, ICreateUserRequest, ILoginDemoUserReply, ILoginDemoUserRequest } from "./legacyapi";
import { UserMessages } from "./phclient";
import { error } from "../tools/assert";
import { createUserId } from "../tools/guid";

export interface IUserActionLoggedIn {
  type: string; // USERACTION_LOGGEDIN
  userDetails: UserDetails;
}

export interface IUserActionFailed {
  type: string; // USERACTION_FAILED
  result: Api.ApiResult;
}

export async function updateUser(userDetails: UserDetails): Promise<IUpdateUserReply> {
  return await rootStore.dispatch<any>(updateUserAction(userDetails));
}
export function updateUserAction(userDetails: UserDetails, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IUpdateUserReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IUpdateUserReply> => {
    const response: IUpdateUserReply = await Api.postJson(UserRequestRoutes.UpdateUser, {
      userDetails: userDetails,
    } as IUpdateUserRequest);
    dispatch<any>(response);
    return response;
  };
}

export async function updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUpdatePasswordReply> {
  return await rootStore.dispatch<any>(updatePasswordAction(userId, oldPassword, newPassword));
}
export function updatePasswordAction(userId: string, oldPassword: string, newPassword: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IUpdatePasswordReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IUpdatePasswordReply> => {
    const response: IUpdatePasswordReply = await Api.postJson(UserRequestRoutes.UpdatePassword, {
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword
    } as IUpdatePasswordRequest);
    dispatch<any>(response);
    return response;
  };
}

export function updateUserInState(user: UserDetails): void {
  if (user != null) {
    const message: AnyAction = {
      type: UserMessages.UserLoadedMessage as UserMessages,
      user: user
    };
    message.workspaceState = rootStore.getState().workspaceState;
    message.instanceState = rootStore.getState().instanceState;
    message.processState = rootStore.getState().processState;
    rootStore.dispatch<IUserLoadedMessage>(message);
  }
}

// Wrapper für einfachen Aufruf aus den Komponenten
export async function loginUser(user: string, password: string): Promise<ILoginReply> {
  return await rootStore.dispatch<any>(loginUserAction(user, password));
}
export async function loginUserWithToken(user: string, accessToken: string): Promise<ILoginReply> {
  return await rootStore.dispatch<any>(loginUserAction(user, null, accessToken));
}
export async function loginUserWithGoogleToken(userMail: string, userName: string, userProfilePictureLink: string, googleAccessToken: string): Promise<ILoginReply> {
  return await rootStore.dispatch<any>(loginUserAction(userMail, null, googleAccessToken, true, userName, userProfilePictureLink));
}

// Diese eigentliche Action wird für Mock-Store Tests genutzt
export function loginUserAction(mail: string, password: string, accessToken: string = null, isGoogleAccessToken = false, userNameFromGoogle: string = null, userProfilePictureLink: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<ILoginReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<ILoginReply> => {
    const response: ILoginReply = await Api.postJson(UserRequestRoutes.Login, {
      mail: mail,
      password: password,
      accessToken: accessToken,
      isGoogleAccessToken: isGoogleAccessToken
    } as ILoginRequest);

    dispatch<any>(response);
    return response;
  };
}

export async function loginDemoUser(): Promise<ILoginDemoUserReply> {
  return await rootStore.dispatch<any>(loginDemoUserAction());
}
export function loginDemoUserAction(): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<ILoginDemoUserReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<ILoginDemoUserReply> => {
    const response: ILoginDemoUserReply = await Api.postJson(UserRequestRoutes.LoginDemoUser, {} as ILoginDemoUserRequest);

    dispatch<any>(response);
    return response;
  };
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

export async function uploadProfilePicture(dataBase64: string): Promise<ILoadUserReply> {
  return await rootStore.dispatch<any>(uploadProfilePictureAction(dataBase64));
}
export function uploadProfilePictureAction(data: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<ILoadUserReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<ILoadUserReply> => {
    const response: ILoadUserReply = await Api.postJson(UserRequestRoutes.UploadProfilePicture, {
      data
    } as IUploadProfilePictureRequest);

    if (response.userDetails != null) {
      updateUserInState(response.userDetails);
    }
    return response;
  };
}

export async function logoutUser(accessToken?: string): Promise<void> {
  await rootStore.dispatch<any>(logoutUserAction(accessToken));
}
// Diese eigentliche Action wird für Mock-Store Tests genutzt
export function logoutUserAction(accessToken?: string): (dispatch: Dispatch<any>) => Promise<void> {
  return function (dispatch: Dispatch<any>): Promise<void> {
    return Api.postJson(UserRequestRoutes.Logout, null, accessToken).then(() => {
      // Do nothing
    }).catch(reason => error(reason));
  };
}

export async function createUser(mail: string, realName: string, password: string, company: string, phone: string): Promise<void> {
  await rootStore.dispatch<any>(createUserAction(mail, realName, password, company, phone));
}
export function createUserAction(mail: string, realName: string, password: string, company: string, phone: string): (dispatch: Dispatch<any>) => Promise<void> {
  return function (dispatch: Dispatch<any>): Promise<void> {
    const userDetails: UserDetails = {
      userId: createUserId(),
      mail: mail,
      realName: realName,
      extras: {}
    };
    const request: ICreateUserRequest = {
      userDetails: userDetails,
      password: password,
      company,
      phone,
    };
    return Api.postJson(UserRequestRoutes.Register, request).then((response: ILoginReply) => {
      dispatch(response);
      // Nur Weiterleiten, wenn erfolgreich
      if (response.result === Api.ApiResult.API_OK) {
        if (typeof window !== "undefined") { // Window not available in unit tests
          window.location.href = "/";
        }
      }
    }).catch((reason: {}) => error(reason.toString()));
  };
}

export async function deleteUser(): Promise<void> {
  await rootStore.dispatch<any>(deleteUserAction());
}
export function deleteUserAction() {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<void> => {
    await Api.postJson(UserRequestRoutes.DeleteUser, null);
  };
}