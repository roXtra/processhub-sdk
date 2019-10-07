import gql from "graphql-tag";
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

export interface IInstanceDetails {
  // Changes must also be reflected in gqlTypes and gqlFragments below!

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
  extras: {
    // New Extras must be added to cache-handling in instanceactions -> loadInstance!
    instanceState: IEngineState | null;
    fieldContents?: IFieldContentMap;
    roleOwners?: IRoleOwnerMap;
    todos?: ITodoDetails[];
    auditTrail?: IAuditTrailEntry[];
  };
}

export const gqlInstanceTypes = `
  type ExtrasInstance {
    instanceState: Json
    fieldContents: FieldContents
    roleOwners: RoleOwnerMap
  }

  type IInstanceDetails {
    instanceId: String!
    workspaceId: String
    processId: String
    displayName: String
    urlName: String
    fullUrl: String
    createdAt: Date
    isSimulation: Boolean
    sendSimulationMails: Boolean
    state: Int
    latestCommentAt: Date
    extras: ExtrasInstance
  }

  scalar RoleOwnerMap
  scalar FieldContents
`;

export const gqlProcessFragments = gql`
fragment InstanceDetailsFields on IInstanceDetails {
  instanceId
  workspaceId
  processId
  displayName
  urlName
  fullUrl
  createdAt
  isSimulation  
  sendSimulationMails
  state
  latestCommentAt
}`;

export enum InstanceExtras {
  None = 0,
  ExtrasState = 1 << 0,
  ExtrasRoleOwners = 1 << 1,
  ExtrasRoleOwnersWithNames = 1 << 2, // Include roleowner-names
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