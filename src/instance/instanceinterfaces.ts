import { IRoleOwnerMap } from "../process";
import { IDecisionTask, ITodoDetails } from "../todo";
import { IFieldContentMap } from "../data";
import { Bpmn } from "modeler/bpmn/bpmn";
import { IAuditTrailEntry } from "../audittrail/audittrailinterfaces";

export enum State {
  // DON'T CHANGE NUMBERS - used in database
  Running = 1,
  Finished = 2,
  Canceled = 3,
}

export interface IParentProcessConfig {
  parentInstanceId: string;
  parentTodoId: string;
  parentUsedToken: string;
}

export interface IRiskAssessmentValue {
  assessments: { [dimensionId: string]: number };
  comment: string;
}

export interface IRiskAssessment extends IRiskAssessmentValue {
  // The date when the assessment was made
  date: Date;
  // The date when the assessment was expected
  todoDate: Date;
  assessmentId: string;
  userId: string;
  userDisplayName: string;
}

export interface IInstanceDetails {
  instanceId: string;
  workspaceId: string;
  processId: string;
  // DisplayName?: string;
  // instanceNumber?: string;  // 123.4567.890, created on execution
  fullUrl?: string; // = /i/@workspace/instanceid
  createdAt?: Date;
  completedAt?: Date;
  isSimulation?: boolean;
  sendSimulationMails?: boolean;
  state?: State;
  latestCommentAt?: Date; // Datetime of the latest comment or incoming mail
  processXmlHash?: string;
  color?: string;
  runningSubProcesses?: string[]; // Contains list for running subinstances
  subInstanceIds?: string[];
  parentProcessConfigObject?: IParentProcessConfig;
  riskAssessments?: IRiskAssessment[];
  extras: {
    // New Extras must be added to cache-handling in instanceactions -> loadInstance!
    instanceState: IEngineState | null;
    fieldContents?: IFieldContentMap;
    roleOwners?: IRoleOwnerMap;
    todos?: ITodoDetails[];
    auditTrail?: IAuditTrailEntry[];
  };
}

export enum InstanceExtras {
  None = 0,
  ExtrasState = 1 << 0,
  ExtrasRoleOwners = 1 << 1, // Include roleowner-names
  ExtrasFieldContents = 1 << 3,
  ExtrasTodos = 1 << 4,
  ExtrasAuditTrail = 1 << 5
}

export interface IResumeInstanceDetails {
  workspaceId: string;
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: IDecisionTask;
  fieldContents?: IFieldContentMap;
}

export interface IEngineState {
  name: string;
  state: string;
  engineVersion: string;
  definitions: IEngineStateDefinition[];
}

export interface IEngineStateDefinition {
  id: string;
  state: string;
  moddleContext: any;
  stopped: boolean;
  processes: IEngineStateDefinitionProcess;
  environment: any;
  entryPointId?: string;
}

export interface IEngineStateDefinitionProcess {
  [id: string]: IEngineStateDefinitionProcessDetails;
}

export interface IEngineStateDefinitionProcessDetails {
  id: string;
  type: Bpmn.bpmnType;
  entered: boolean;
  variables: any;
  services: any;
  children: IEngineStateDefinitionChild[];
  environment: any;
}

export interface IEngineStateDefinitionChild {
  id: string;
  type: Bpmn.bpmnType;
  entered?: string[];
  canceled?: boolean;
  waiting?: boolean;
  taken?: boolean;
  token?: string;
  holdedToken?: string;
  pendingJoin?: boolean;
  pendingInbound?: string[];
  pendingOutbound?: string[];
  discardedInbound?: string[];
  attachedToId?: string;
  timeout?: number;
  duration?: number;
  startedAt?: string;
}