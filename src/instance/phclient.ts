// Internal objects used by ProcessHub client and server
import { InstanceDetails } from "./instanceinterfaces";

export class InstanceState {
  currentInstance?: InstanceDetails;

  // Instance Cache
  instanceCache: {
    [instanceId: string]: InstanceDetails;
  };

  cacheState?: string;  // Updated in reducers, helps React to detect state changes
  lastDispatchedInstance: InstanceDetails; // Used in reducer to detect changes
}
