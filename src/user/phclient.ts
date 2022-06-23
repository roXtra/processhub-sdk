import { IUserDetails } from "./userinterfaces";
import { ApiResult } from "../legacyapi/apiinterfaces";

// Internal objects used by ProcessHub client and server

export class UserState {
  currentUser?: IUserDetails;

  lastApiResult?: ApiResult; // Result of the last Api call

  // updated in reducers, helps React to detect state changes
  cacheState?: string;
  lastDispatchedUser?: IUserDetails; // Used in reducer to detect changes
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",
  InstanceLoadedMessage: "InstanceLoadedMessage",
  RemoveInstanceMessage: "RemoveInstanceMessage",
  NewInstanceMessage: "NewInstanceMessage",

  Failed: "FAILED",
};
export type UserMessages = keyof typeof UserMessages;
