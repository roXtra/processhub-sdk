import { ApiResult } from "../legacyapi/apiinterfaces";
import { IUserDetails } from "./userinterfaces";

// Internal objects used by ProcessHub client and server

export type StateUserExtras = Omit<IUserDetails["extras"], "workspaces"> & {
  // User from state references only workspaceIds, not the actual workspaces in the user state.
  workspaceIds?: string[];

  // User from state references only instanceIds, not the actual instances in the user state.
  instanceIds?: string[];
};

export type StateUserDetails = Omit<IUserDetails, "extras"> & {
  extras: StateUserExtras;
};

export class UserState {
  currentUser?: StateUserDetails;

  lastApiResult?: ApiResult; // Result of the last Api call

  // updated in reducers, helps React to detect state changes
  cacheState?: string;
  lastDispatchedUser?: StateUserDetails; // Used in reducer to detect changes
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",
  InstanceLoadedMessage: "InstanceLoadedMessage",
  RemoveInstanceMessage: "RemoveInstanceMessage",
  NewInstanceMessage: "NewInstanceMessage",

  Failed: "FAILED",
};
export type UserMessages = keyof typeof UserMessages;
