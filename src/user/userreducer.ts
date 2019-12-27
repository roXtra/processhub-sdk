import * as _ from "lodash";
import update from "immutability-helper";
import { ApiResult } from "../legacyapi/apiinterfaces";
import { IUserActionLoggedIn, IUserActionFailed } from "./useractions";
import * as StateHandler from "../statehandler";
import { UserState, UserMessages } from "./phclient";
import { IUserLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { UserActionsType } from "./userinterfaces";
import { isTrue } from "../tools/assert";
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
    case UserActionsType.LoggedIn: {
      const loggedAction: IUserActionLoggedIn = action as IUserActionLoggedIn;
      isTrue(loggedAction.userDetails != null, "loggedAction.userDetails is null");
      return update(userState, {
        currentUser: { $set: loggedAction.userDetails },
        lastApiResult: { $set: ApiResult.API_OK }
      });
    }
    case UserActionsType.Failed: {
      const failedAction: IUserActionFailed = action as IUserActionFailed;
      isTrue(failedAction.result != null, "failedAction.result is null");
      return update(userState, {
        lastApiResult: { $set: failedAction.result }
      });
    }
    default:
      return userState;
  }
}
