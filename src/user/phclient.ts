import { ApiResult } from "../legacyapi/apiinterfaces.js";
import { IUserDetails } from "./userinterfaces.js";

// Internal objects used by ProcessHub client and server

export type StateUserExtras = Omit<IUserDetails["extras"], "workspaces" | "instances"> & {
  // User from state references only workspaceIds, not the actual workspaces in the user state.
  workspaceIds?: string[];

  // User from state references only instanceIds, not the actual instances in the user state.
  instanceIds?: string[];
};

export type StateUserDetails = Omit<IUserDetails, "extras" | "type"> & {
  type: "state";
  extras: StateUserExtras;
};

export class UserState {
  currentUser?: StateUserDetails;

  lastApiResult?: ApiResult; // Result of the last Api call

  lastDispatchedUser?: StateUserDetails; // Used in reducer to detect changes
}

type UserLoadedMessageType = "UserLoadedMessage";
const UserLoadedMessage: UserLoadedMessageType = "UserLoadedMessage";

type InstanceLoadedMessageType = "InstanceLoadedMessage";
const InstanceLoadedMessage: InstanceLoadedMessageType = "InstanceLoadedMessage";

type RemoveInstanceMessageType = "RemoveInstanceMessage";
const RemoveInstanceMessage: RemoveInstanceMessageType = "RemoveInstanceMessage";

type NewInstanceMessageType = "NewInstanceMessage";
const NewInstanceMessage: NewInstanceMessageType = "NewInstanceMessage";

type FailedType = "Failed";
const Failed: FailedType = "Failed";

type SetViewStatesMessageType = "SetViewStatesMessage";
const SetViewStatesMessage: SetViewStatesMessageType = "SetViewStatesMessage";

type AddFavoriteProcessMessageType = "AddFavoriteProcessMessage";
const AddFavoriteProcessMessage: AddFavoriteProcessMessageType = "AddFavoriteProcessMessage";

type RemoveFavoriteProcessMessageType = "RemoveFavoriteProcessMessage";
const RemoveFavoriteProcessMessage: RemoveFavoriteProcessMessageType = "RemoveFavoriteProcessMessage";

type SetArchiveViewMessageType = "SetArchiveViewMessage";
const SetArchiveViewMessage: SetArchiveViewMessageType = "SetArchiveViewMessage";

export const UserMessages = {
  UserLoadedMessage,
  InstanceLoadedMessage,
  RemoveInstanceMessage,
  NewInstanceMessage,
  Failed,
  SetViewStatesMessage,
  AddFavoriteProcessMessage,
  RemoveFavoriteProcessMessage,
  SetArchiveViewMessage,
};

export type UserMessages = keyof typeof UserMessages;
