import { IProcessDetails } from "./processinterfaces";

export type StateProcessExtras = Omit<IProcessDetails["extras"], "instances">;

export type StateProcessDetails = Omit<IProcessDetails, "extras" | "type"> & {
  extras: StateProcessExtras;
  type: "state";
};

export class ProcessState {
  currentProcess: StateProcessDetails | undefined;
  processesById: { [processId: string]: StateProcessDetails } = {};
}
