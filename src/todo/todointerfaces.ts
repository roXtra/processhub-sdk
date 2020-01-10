import { UserDetails } from "../user";
import { Bpmn } from "../process/bpmn";

export enum TodoStatus {
  TodoOnTime = 0,
  TodoOverdue = 2
}

export enum TodoType {
  Regular = 0,
  Simulation = 1, // Deprecated: maybe delete on some point and remove all simulation code
  SubProcess = 2,
  Intermediate = 3,
  SubProcessWaitingForStart = 4
}

export interface ITodoDetails {
  todoId: string;
  todoType?: TodoType;
  userId?: string;
  workspaceId: string;
  processId: string;
  instanceId: string;
  status?: TodoStatus;
  displayName: string;
  description: string;
  bpmnTaskId: string;
  bpmnLaneId: string;
  createdAt?: Date;
  user?: UserDetails;
  priority?: number;
  isPinned?: boolean;
  dueAt?: Date;
  subInstanceId?: string;
  token?: string;
}

export const DecisionTaskTypes = {
  Normal: "normal",
  Boundary: "boundary"
};
export type DecisionTaskTypes = keyof typeof DecisionTaskTypes;

export interface IDecisionTask {
  bpmnTaskId: string;
  name: string;
  type: DecisionTaskTypes;
  isBoundaryEvent: boolean;
  boundaryEventType?: Bpmn.bpmnType;
  // RouteStack?: string[];
}
