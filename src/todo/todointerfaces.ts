import { UserDetails } from "../user";
import { Bpmn } from "../process/bpmn";
import { RiskAssessmentCycle } from "../riskassessment/riskassessmentinterfaces";

export enum TodoStatus {
  TodoOnTime = 0,
  TodoOverdue = 2
}

export enum TodoType {
  // A regular UserTask or ExclusiveGateway
  Regular = 0,
  // A simularion todo
  Simulation = 1,
  // A running SubProcess
  SubProcess = 2,
  // Intermediate CatchEvent waiting for timer/mail
  Intermediate = 3,
  // SubProcess with missing role, will be started as soon as role was set
  SubProcessWaitingForStart = 4
}

export interface ITodoDetails {
  todoId: string;
  todoType: TodoType;
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
  dueAt?: Date;
  subInstanceId?: string;
  token?: string;
  // Additional data a todo can contain, may depend on the module
  data: {
    // The risk assessment cycle of the risk at the time the todo was created
    riskAssessmentCycle?: RiskAssessmentCycle;
  };
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
