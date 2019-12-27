import * as _ from "lodash";
import update from "immutability-helper";
import * as StateHandler from "../statehandler";
import * as Notification from "../notification";
import { InstanceState } from "./phclient";
import { INSTANCELOADED_MESSAGE, IInstanceLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { IRemoveInstanceMessage, INewInstanceMessage } from "../user/legacyapi";
import { UserMessages } from "../user/phclient";
import { ResetStore } from "../statehandler/actions";

export function instanceReducer(instanceState: InstanceState, action: any): InstanceState {

  if (instanceState == null || action && action.type === ResetStore) {
    // Init state
    instanceState = new InstanceState();
    instanceState.instanceCache = {};
  }
  if (action == null || action.type === ResetStore)
    return instanceState;

  switch (action.type) {

    case INSTANCELOADED_MESSAGE: {
      instanceState.currentInstance = StateHandler.mergeInstanceToCache((action as IInstanceLoadedMessage).instance);

      const instanceChanged = !_.isEqual(instanceState.currentInstance, instanceState.lastDispatchedInstance);
      instanceState.lastDispatchedInstance = _.cloneDeep(instanceState.currentInstance);

      // React cannot detect state changes in objects. Updating cacheState triggers rendering
      // -> only render if data has changed
      if (instanceChanged) {
        return update(instanceState, {
          cacheState: { $set: createId() }
        });
      } else {
        return instanceState;
      }
    }
    case UserMessages.RemoveInstanceMessage:
      StateHandler.removeInstanceFromCache((action as IRemoveInstanceMessage).instanceId);

      return update(instanceState, {
        cacheState: { $set: createId() }
      });

    case UserMessages.NewInstanceMessage: {
      const instanceId = (action as INewInstanceMessage).instanceId;
      Notification.subscribeUpdateInstance(instanceId);
      return instanceState;
    }
    default:
      return instanceState;
  }
}