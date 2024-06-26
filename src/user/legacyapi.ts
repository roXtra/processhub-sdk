import { IBaseRequest, IBaseMessage } from "../legacyapi/apiinterfaces.js";
import { IUserDetails, UserExtras, IViewState } from "./userinterfaces.js";
import { StateUserDetails, UserMessages } from "./phclient.js";

export const UserRequestRoutes = {
  GetAllUserFromWorkspace: "/api/user/getallfromworkspace",
  LoadUser: "/api/user/loaduser",
  SetArchiveViewState: "/api/user/setarchiveviewstate",
  UpdateViewState: "/api/user/updateviewstate",
  SetFavoriteProcess: "/api/user/setfavoriteprocess",
  RemoveFavoriteProcess: "/api/user/removefavoriteprocess",
  LogComponentError: "/api/user/logcomponenterror",
};
export type UserRequestRoutes = keyof typeof UserRequestRoutes;

export interface IUpdateViewStateRequest extends IBaseRequest {
  objectId: string;
  viewState: IViewState;
}

export interface ILoadUserRequest extends IBaseRequest {
  userId?: string; // If null userId will be determined by server from AccessToken cookie
  getExtras: UserExtras;
}
export interface ILoadUserReply extends IBaseMessage {
  userDetails?: IUserDetails;
}

export interface IUserLoadedMessage extends IBaseMessage {
  type: UserMessages;
  user?: StateUserDetails | IUserDetails;
}

export interface ISetArchiveViewStateRequest extends IBaseRequest {
  processId: string | undefined;
  archiveViewId: string | undefined;
}

// Nes websocket messages
export interface IRemoveInstanceMessage extends IBaseMessage {
  type: UserMessages;
  instanceId: string;
  processId: string;
}
export interface INewInstanceMessage extends IBaseMessage {
  type: UserMessages;
  instanceId: string;
}

export interface IRemoveFavoriteProcessRequest extends IBaseRequest {
  processId: string;
}

export interface ISetFavoriteProcessRequest extends IRemoveFavoriteProcessRequest {
  workspaceId: string;
}

export interface ISetViewStatesMessage extends IBaseMessage {
  type: UserMessages;
  instanceOrProcessId?: string;
  viewDate?: Date;
}

export interface IRemoveFavoriteProcessMessage extends IBaseMessage {
  type: UserMessages;
  processId: string;
}

export interface IAddFavoriteProcessMessage extends IRemoveFavoriteProcessMessage {
  workspaceId: string;
}

export interface ISetArchiveViewMessage extends IBaseMessage {
  type: UserMessages;
  processOrModuleId: string | number;
  viewId?: string;
}

export interface ILogComponentErrorRequest extends IBaseRequest {
  error: string;
  info: string;
}
