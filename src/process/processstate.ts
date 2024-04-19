import { IProcessDetails } from "./processinterfaces.js";

export type StateProcessExtras = Omit<IProcessDetails["extras"], "instances"> & {
  // Process from state references only instanceIds, not the actual instances in the process state
  // Map with instanceIds for better performance
  instanceIds?: { [instanceId: string]: boolean };
};
export type StateProcessDetails = Omit<IProcessDetails, "extras" | "type"> & {
  extras: StateProcessExtras;
  type: "state";
};

export class ProcessState {
  currentProcess: StateProcessDetails | undefined;
  processesById: { [processId: string]: StateProcessDetails } = {};
}
