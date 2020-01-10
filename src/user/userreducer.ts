import * as _ from "lodash";
import update from "immutability-helper";
import * as StateHandler from "../statehandler";
import { UserState, UserMessages } from "./phclient";
import { IUserLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { ResetStore } from "../statehandler/actions";
import { AnyAction } from "redux";

export function userReducer(userState: UserState, action: AnyAction): UserState {
  let newState = _.cloneDeep(userState);

  if (userState == null || action && action.type === ResetStore) {
    // Init state
    newState = new UserState();
  }
  if (action == null || action.type === ResetStore)
    return newState;

  switch (action.type) {

    case UserMessages.UserLoadedMessage: {
      const user = (action as IUserLoadedMessage).user;
      newState.currentUser = StateHandler.mergeUserToCache(user, action.workspaceState, action.processState, action.userState, action.instanceState);

      const userChanged = !_.isEqual(userState.currentUser, userState.lastDispatchedUser);
      newState.lastDispatchedUser = _.cloneDeep(userState.currentUser);

      if (userChanged) {
        return update(newState, {
          cacheState: { $set: createId() }
        });
      } else
        return newState;
    }
    default:
      return newState;
  }
}
