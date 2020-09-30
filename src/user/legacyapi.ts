import { IBaseRequest, IBaseMessage } from "../legacyapi/apiinterfaces";
import { UserDetails, UserExtras, IViewState } from "./userinterfaces";
import { UserMessages } from "./phclient";

export const UserRequestRoutes = {
  GetAllUserFromWorkspace: "/api/user/getallfromworkspace",
  LoadUser: "/api/user/loaduser",
  SetArchiveViewState: "/api/user/setarchiveviewstate",
  UpdateViewState: "/api/user/updateviewstate",
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
  userDetails?: UserDetails;
}

export interface IUserLoadedMessage extends IBaseMessage {
  type: UserMessages;
  user?: UserDetails;
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
