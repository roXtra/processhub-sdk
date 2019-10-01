import { rootStore } from "../statehandler";
import { Dispatch } from "redux";
import * as StateHandler from "../statehandler";
import * as Api from "../legacyapi";
import { UserDetails, UserExtras } from "./userinterfaces";
import { LoadUserReply, UpdateUserReply, UserRequestRoutes, UpdateUserRequest, UpdatePasswordReply, UpdatePasswordRequest, UserLoadedMessage, LoginReply, LoginRequest, LoadUserRequest, UploadProfilePictureRequest, CreateUserRequest, LoginDemoUserReply, LoginDemoUserRequest } from "./legacyapi";
import { UserMessages } from "./phclient";
import { error } from "../tools/assert";
import { createUserId } from "../tools/guid";

export interface UserActionLoggedIn {
  type: string; // USERACTION_LOGGEDIN
  userDetails: UserDetails;
}

export interface UserActionFailed {
  type: string; // USERACTION_FAILED
  result: Api.ApiResult;
}

export async function updateUser(userDetails: UserDetails): Promise<UpdateUserReply> {
  return await rootStore.dispatch(updateUserAction(userDetails));
}
export function updateUserAction(userDetails: UserDetails, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<UpdateUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<UpdateUserReply> => {
    const response: UpdateUserReply = await Api.postJson(UserRequestRoutes.UpdateUser, {
      userDetails: userDetails,
    } as UpdateUserRequest);
    dispatch(response);
    return response;
  };
}

export async function updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<UpdatePasswordReply> {
  return await rootStore.dispatch(updatePasswordAction(userId, oldPassword, newPassword));
}
export function updatePasswordAction(userId: string, oldPassword: string, newPassword: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<UpdatePasswordReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<UpdatePasswordReply> => {
    const response: UpdatePasswordReply = await Api.postJson(UserRequestRoutes.UpdatePassword, {
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword
    } as UpdatePasswordRequest);
    dispatch(response);
    return response;
  };
}

export function updateUserInState(user: UserDetails): void {
  if (user != null) {
    const message: UserLoadedMessage = {
      type: UserMessages.UserLoadedMessage as UserMessages,
      user: user
    };
    rootStore.dispatch<UserLoadedMessage>(message);
  }
}

// Wrapper für einfachen Aufruf aus den Komponenten
export async function loginUser(user: string, password: string): Promise<LoginReply> {
  return await rootStore.dispatch(loginUserAction(user, password));
}
export async function loginUserWithToken(user: string, accessToken: string): Promise<LoginReply> {
  return await rootStore.dispatch(loginUserAction(user, null, accessToken));
}
export async function loginUserWithGoogleToken(userMail: string, userName: string, userProfilePictureLink: string, googleAccessToken: string): Promise<LoginReply> {
  return await rootStore.dispatch(loginUserAction(userMail, null, googleAccessToken, true, userName, userProfilePictureLink));
}

// Diese eigentliche Action wird für Mock-Store Tests genutzt
export function loginUserAction(mail: string, password: string, accessToken: string = null, isGoogleAccessToken = false, userNameFromGoogle: string = null, userProfilePictureLink: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoginReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoginReply> => {
    const response:
    LoginReply = await Api.postJson(UserRequestRoutes.Login, {
      mail: mail,
      password: password,
      accessToken: accessToken,
      isGoogleAccessToken: isGoogleAccessToken
    } as LoginRequest);

    dispatch(response);
    return response;
  };
}

export async function loginDemoUser(): Promise<LoginDemoUserReply> {
  return await rootStore.dispatch(loginDemoUserAction());
}
export function loginDemoUserAction(): <S>(dispatch: Dispatch<S>) => Promise<LoginDemoUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoginDemoUserReply> => {
    const response:
    LoginDemoUserReply = await Api.postJson(UserRequestRoutes.LoginDemoUser, {} as LoginDemoUserRequest);

    dispatch(response);
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
  return (await rootStore.dispatch(loadUserAction(userId, getExtras, accessToken))).userDetails;
}

export function loadUserAction(userId: string, getExtras: UserExtras, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoadUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoadUserReply> => {
    const request: LoadUserRequest = {
      userId: userId,
      getExtras: getExtras
    };
    const response: LoadUserReply = await Api.postJson(UserRequestRoutes.LoadUser, request);
    if (response.userDetails != null) {
      updateUserInState(response.userDetails);
    }
    return response;
  };
}

export async function uploadProfilePicture(dataBase64: string): Promise<LoadUserReply> {
  return await rootStore.dispatch(uploadProfilePictureAction(dataBase64));
}
export function uploadProfilePictureAction(data: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoadUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoadUserReply> => {
    const response: LoadUserReply = await Api.postJson(UserRequestRoutes.UploadProfilePicture, {
      data
    } as UploadProfilePictureRequest);

    if (response.userDetails != null) {
      updateUserInState(response.userDetails);
    }
    return response;
  };
}

export async function logoutUser(accessToken?: string) {
  await rootStore.dispatch(logoutUserAction(accessToken));
}
// Diese eigentliche Action wird für Mock-Store Tests genutzt
export function logoutUserAction(accessToken?: string) {
  return function (dispatch: any) {
    return Api.postJson(UserRequestRoutes.Logout, null, accessToken).then(() => {
    }).catch(reason => error(reason));
  };
}

export async function createUser(mail: string, realName: string, password: string, company: string, phone: string) {
  await rootStore.dispatch(createUserAction(mail, realName, password, company, phone));
}
export function createUserAction(mail: string, realName: string, password: string, company: string, phone: string) {
  return function (dispatch: any) {
    const userDetails: UserDetails = {
      userId: createUserId(),
      mail: mail,
      realName: realName,
      extras: {}
    };
    const request: CreateUserRequest = {
      userDetails: userDetails,
      password: password,
      company,
      phone,
    };
    return Api.postJson(UserRequestRoutes.Register, request).then((response: LoginReply) => {
      dispatch(response);
      // Nur Weiterleiten, wenn erfolgreich
      if (response.result === Api.ApiResult.API_OK) {
        if (typeof window !== "undefined") { // Window not available in unit tests
          (window as any).dataLayer.push({ "event": "registered" });
          window.location.href = "/";
        }
      }
    }).catch((reason: any) => error(reason));
  };
}

export async function deleteUser(): Promise<void> {
  await rootStore.dispatch(deleteUserAction());
}
export function deleteUserAction() {
  return async <S>(dispatch: Dispatch<S>): Promise<void> => {
    await Api.postJson(UserRequestRoutes.DeleteUser, null);
  };
}