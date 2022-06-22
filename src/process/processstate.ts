import { IProcessDetails } from "./processinterfaces";

export type StateProcessExtras = Omit<IProcessDetails["extras"], "instances"> & {
  // Process from state references only instanceIds, not the actual instances in the process state
  instanceIds?: string[];
};
export type StateProcessDetails = Omit<IProcessDetails, "extras"> & {
  extras: StateProcessExtras;
};

export class ProcessState {
  currentProcess: StateProcessDetails | undefined;
}
