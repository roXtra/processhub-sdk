// Internal objects used by ProcessHub client and server
import { Page } from "../path";
import { Tools } from "../";
import * as PH from "../";

export class InstanceState {
  currentInstance?: PH.Instance.InstanceDetails;

  // Instance Cache
  instanceCache: {
    [instanceId: string]: PH.Instance.InstanceDetails
  };  

  cacheState?: string;  // updated in reducers, helps React to detect state changes
  lastDispatchedInstance: PH.Instance.InstanceDetails; // used in reducer to detect changes
}
