import { IBaseRequest, IBaseMessage } from "../legacyapi/apiinterfaces";
import { UserDetails, UserExtras, IViewState } from "./userinterfaces";
import { UserMessages } from "./phclient";

export const UserRequestRoutes = {
  Login: "/api/user/login",
  Logout: "/api/user/logout",
  Register: "/api/user/register",
  PasswordLost: "/api/user/passwordlost",
  ResetPassword: "/api/user/resetpwd",
  GetAllUserFromWorkspace: "/api/user/getallfromworkspace",
  ConfirmMail: "/api/user/confirmmail",
  UpdateUser: "/api/user/update",
  UpdatePassword: "/api/user/passwordupdate",
  LoadUser: "/api/user/loaduser",
  UploadProfilePicture: "/api/user/uploadprofilepicture",
  LoginDemoUser: "/api/user/logindemo",
  DeleteUser: "/api/user/deleteuser",
  SetArchiveViewState: "/api/user/setarchiveviewstate",
  UpdateViewState: "/api/user/updateviewstate"
};
export type UserRequestRoutes = keyof typeof UserRequestRoutes;

export interface IUpdateViewStateRequest extends IBaseRequest {
  objectId: string;
  viewState: IViewState;
}

export interface ICreateUserRequest extends IBaseRequest {
  userDetails: UserDetails;
  password: string;
  company: string;
  phone: string;
}

export interface ILoginRequest extends IBaseRequest {
  mail: string;
  password: string;
  accessToken: string;
  isGoogleAccessToken: boolean;
}
export interface ILoginReply extends IBaseMessage {
  userDetails?: UserDetails;
}

export interface ILoadUserRequest extends IBaseRequest {
  userId?: string; // If null userId will be determined by server from AccessToken cookie
  getExtras: UserExtras;
}
export interface ILoadUserReply extends IBaseMessage {
  userDetails?: UserDetails;
}

export interface ILoginDemoUserRequest extends IBaseRequest {
}
export interface ILoginDemoUserReply extends IBaseMessage {
  userDetails?: UserDetails;
  accessToken?: string;
}

export interface IUpdateUserRequest extends IBaseRequest {
  userDetails: UserDetails;
}
export interface IUpdateUserReply extends IBaseMessage {
}

export interface IUpdatePasswordRequest extends IBaseRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
export interface IUpdatePasswordReply extends IBaseMessage {
}

export interface IUserLoadedMessage extends IBaseMessage {
  type: UserMessages;
  user?: UserDetails;
}

export interface ISendPasswordResetLinkRequest extends IBaseMessage {
  email: string;
}

export interface IResetPasswordRequest extends IBaseMessage {
  secret: string;
  password: string;
}

export interface IConfirmMailRequest extends IBaseMessage {
  token: string;
}

export interface IUploadProfilePictureRequest extends IBaseMessage {
  data: string;
}

export interface ISetArchiveViewStateRequest extends IBaseRequest {
  processId: string;
  archiveViewId: string;
}

// Nes websocket messages
export interface IRemoveInstanceMessage extends IBaseMessage {
  type: UserMessages;
  instanceId: string;
}
export interface INewInstanceMessage extends IBaseMessage {
  type: UserMessages;
  instanceId: string;
}
