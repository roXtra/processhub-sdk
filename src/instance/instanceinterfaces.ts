import { IRoleOwnerMap } from "../process";
import { IDecisionTask, ITodoDetails } from "../todo";
import { IFieldContentMap, IProcessLinkInstance } from "../data";
import { Bpmn } from "modeler/bpmn/bpmn";
import { IAuditTrailEntry } from "../audittrail/audittrailinterfaces";
import { Context } from "moddle-xml/lib/reader";
import { RiskAssessmentCycle } from "../riskassessment/riskassessmentinterfaces";

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
  // Id of the assessment
  assessmentId: string;
  // The date when the assessment was made
  date: Date;
  // The date when the assessment was expected
  todoDate: Date;
  // The assessment cycle at the time when the assessment was expected
  cycle: RiskAssessmentCycle;
  // The id of the user that made the assessment
  userId: string;
  // Displayname of the user that made the assessment
  userDisplayName: string;
}

export interface IInstanceDetails {
  instanceId: string;
  workspaceId: string;
  processId: string;
  title: string;
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
  // Instances with ProcessLink fields that have the current instance as target
  linkingInstances?: IProcessLinkInstance[];
  extras: {
    // New Extras must be added to cache-handling in instanceactions -> loadInstance!
    instanceState?: IEngineState;
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
  timerTriggeredManually?: boolean;
}

export interface IEngineState {
  name: string;
  state: string;
  engineVersion: string;
  definitions?: IEngineStateDefinition[];
}

export interface IEngineStateDefinition {
  id: string;
  state: string;
  moddleContext: Context;
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