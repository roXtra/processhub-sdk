import * as _ from "lodash";
import * as update from "immutability-helper";
import * as StateHandler from "../statehandler";
import { UserState, UserMessages } from "./phclient";
import { IUserLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { ResetStore } from "../statehandler/actions";
import { AnyAction } from "redux";

export function userReducer(userState: UserState, action: AnyAction): UserState {

  if (userState == null || action && action.type === ResetStore) {
    // Init state
    userState = new UserState();
  }
  if (action == null || action.type === ResetStore)
    return userState;

  switch (action.type) {

    case UserMessages.UserLoadedMessage: {
      const user = (action as IUserLoadedMessage).user;
      userState.currentUser = StateHandler.mergeUserToCache(user);

      const userChanged = !_.isEqual(userState.currentUser, userState.lastDispatchedUser);
      userState.lastDispatchedUser = _.cloneDeep(userState.currentUser);

      if (userChanged) {
        return update(userState, {
          cacheState: { $set: createId() }
        });
      } else
        return userState;
    }
    default:
      return userState;
  }
}
