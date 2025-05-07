import { Bpmn } from "modeler/bpmn/bpmn";
import { AuditTrailEntry } from "../audittrail/audittrailentry.js";
import { RiskAssessmentCycle } from "../riskassessment/riskassessmentinterfaces.js";
import BpmnModdle from "bpmn-moddle";
import Joi from "joi";
import { IProcessLinkInstance } from "../data/fields/processlink.js";
import { IFieldContentMap } from "../data/ifieldcontentmap.js";
import { IRoleOwnerMap } from "../process/processrights.js";
import { ITodoDetails, IDecisionTask } from "../todo/todointerfaces.js";
import { ICustomRating } from "../modules/audits/icustomrating.js";

export enum State {
  // DON'T CHANGE NUMBERS - used in database
  Running = 1,
  Finished = 2,
  Canceled = 3,
  Error = 4,
}

export const StateSchema = Joi.number().max(3).min(1).integer();

export interface IParentProcessConfig {
  parentInstanceId: string;
  parentTodoId: string;
  parentUsedToken: string;
  // Is set to true if the parent instance was started through a bus event
  parentWasStartedByEvent?: boolean;
}

export interface IRiskAssessmentValue {
  assessments: { [dimensionId: string]: number };
  comment: string | undefined;
}

const IRiskAssessmentValueObject: IRiskAssessmentValue = {
  assessments: Joi.object().pattern(Joi.string(), Joi.number()).required() as unknown as { [dimensionId: string]: number },
  comment: Joi.string().allow("") as unknown as string,
};

export const IRiskAssessmentValueSchema = Joi.object(IRiskAssessmentValueObject);

export interface IRiskAssessment extends IRiskAssessmentValue {
  // Id of the assessment
  assessmentId: string;
  // The date when the assessment was made
  date: Date;
  // The date when the assessment was expected
  todoDate: Date;
  // The assessment cycle at the time when the assessment was expected
  cycle: RiskAssessmentCycle | undefined;
  // The id of the user that made the assessment
  userId: string;
  // Displayname of the user that made the assessment
  userDisplayName: string;
  // The name of the field (type "ProcessHubRiskAssessment") the assessment was made with
  fieldName: string;
}

export interface IRiskAssessmentTargetValue {
  targets: { [dimensionId: string]: number };
}

const IRiskAssessmentTargetValueObject: IRiskAssessmentTargetValue = {
  targets: Joi.object().pattern(Joi.string(), Joi.number()).required() as unknown as { [dimensionId: string]: number },
};

export const IRiskAssessmentTargetValueSchema = Joi.object(IRiskAssessmentTargetValueObject);

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
  // Instances with ProcessLink fields that have the current instance as target or source
  instanceLinks?: {
    // Instances with ProcessLink fields that have the current instance as target
    incoming: IProcessLinkInstance[];
    // Instances with ProcessLink fields that have the current instance as source
    outgoing: IProcessLinkInstance[];
  };
  instanceNumber?: number;
  takenStartEvent: string;
  reachedEndEvents: string[];
  // Is set to true if the instance or a parent instance was started through a bus event
  wasStartedByEvent?: boolean;
  auditsCustomRating?: ICustomRating;
  // Precomputed audit metric that can be used if the questions are not available
  auditMetric?: number;
  workflow?: {
    // The id of the roXtra document (source file) if this is a workflow instance
    roXtraFileId?: number;
  };
  extras: {
    // New Extras must be added to cache-handling in instanceactions -> loadInstance!
    instanceState?: IEngineState;
    fieldContents?: IFieldContentMap;
    roleOwners?: IRoleOwnerMap;
    todos?: ITodoDetails[];
    auditTrail?: AuditTrailEntry[];
    // Audit Trail entries that reflect a comment/a mail that was sent to the instance
    commentsTrail?: AuditTrailEntry[];
  };
  concurrencyStamp?: string;
}

export enum InstanceExtras {
  None = 0,
  ExtrasState = 1 << 0,
  ExtrasRoleOwners = 1 << 1, // Include roleowner-names
  ExtrasFieldContents = 1 << 3,
  ExtrasTodos = 1 << 4,
  ExtrasAuditTrail = 1 << 5,
  ExtrasCommentsTrail = 1 << 6,
}

export interface IResumeInstanceDetails {
  workspaceId: string;
  instanceId: string;
  completedTodoId?: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: IDecisionTask;
  fieldContents?: IFieldContentMap;
  timerTriggeredManually?: boolean;
  // Token that can be used to check if the user entered his credentials to complete a todo
  todoSignToken?: string;
  // Must match the instance's concurrencyStamp on the server to prevent concurrency issues
  concurrencyStamp?: string | undefined;
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
  moddleContext: BpmnModdle.IParseResult;
  stopped: boolean;
  processes: IEngineStateDefinitionProcess;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services: any;
  children: IEngineStateDefinitionChild[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
