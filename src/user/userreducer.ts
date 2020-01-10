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
    case UserActionsType.LoggedIn: {
      const loggedAction: IUserActionLoggedIn = action as IUserActionLoggedIn;
      isTrue(loggedAction.userDetails != null, "loggedAction.userDetails is null");
      return update(newState, {
        currentUser: { $set: loggedAction.userDetails },
        lastApiResult: { $set: ApiResult.API_OK }
      });
    }
    case UserActionsType.Failed: {
      const failedAction: IUserActionFailed = action as IUserActionFailed;
      isTrue(failedAction.result != null, "failedAction.result is null");
      return update(newState, {
        lastApiResult: { $set: failedAction.result }
      });
    }
    default:
      return newState;
  }
}
