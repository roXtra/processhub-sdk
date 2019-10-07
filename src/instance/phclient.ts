// Internal objects used by ProcessHub client and server
import { IInstanceDetails } from "./instanceinterfaces";

export class InstanceState {
  currentInstance?: IInstanceDetails;

  // Instance Cache
  instanceCache: {
    [instanceId: string]: IInstanceDetails;
  };

  cacheState?: string;  // Updated in reducers, helps React to detect state changes
  lastDispatchedInstance: IInstanceDetails; // Used in reducer to detect changes
}
