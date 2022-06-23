import { IUserDetails } from "./userinterfaces";

export type StateUserExtras = Omit<IUserDetails["extras"], "workspaces"> & {
  // User from state references only workspaceIds, not the actual workspaces in the user state.
  workspaceIds?: string[];
};

export type StateUserDetails = Omit<IUserDetails, "extras"> & {
  extras: StateUserExtras;
};

export class UserState {
  currentUser: StateUserDetails | undefined;
}
