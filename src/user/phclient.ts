import { ApiResult } from "../legacyapi/apiinterfaces";
import { StateUserDetails } from "./userstate";

// Internal objects used by ProcessHub client and server

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
