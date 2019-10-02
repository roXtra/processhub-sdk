import { ProcessAccessRights, ProcessRoles } from "./processrights";
import { InstanceDetails } from "../instance";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { strEnum } from "../tools/types";
import gql from "graphql-tag";
import { FieldDefinition, TaskIdRequiredFieldsNeeded, ServiceActionConfigField } from "../data";
import { UserDetails } from "../user/userinterfaces";
import { RowDetails } from ".";
import { AuditTrailEntry } from "../audittrail/audittrailinterfaces";

export interface ProcessAttachment {
  attachmentId: string;
  fileName: string;
  url?: string; // Url must be set if it is an uploaded file
  roxFileId?: number; // RoxFileId must be set if the attachment is a link to a roXtra document
  iconLink?: string; // IconLink must be set if the attachment is a link to a roXtra document
}

export interface ProcessReportDraft {
  draftId: string;
  fileName: string;
  url: string;
}

/**
 * Describes the contents of the service.json file that is located in the services'
 */
export interface ServiceJson {
  id: string;
  minRoXtraVersion: string;
  maxRoXtraVersion: string;
  name: string;
  actions: ServiceActionConfig[];
}

export interface ServiceDetails extends ServiceJson {
  foldername: string;
}

export interface ServiceActionConfig {
  id: string;
  label: string;
  configMethod: string;
  settings: string;
  configElement: string;
  fields: ServiceActionField[];
  serviceFile: string;
  serviceMethod: string;
}

/**
 * Predefined functions that set the <select>-Elements options if type is "select"
 */
export type ServiceActionFieldOnloadFunction = "fields" | "reportDrafts" | "reportTypes" | "allProcesses";

export interface ServiceActionField {
  name: string;
  type: "select" | "text";
  onload: ServiceActionFieldOnloadFunction | string;
}

export interface ProcessDetails {
  // Changes must also be reflected in gqlTypes and gqlFragments below!

  processId: string;
  workspaceId: string;
  displayName: string;
  urlName?: string;
  fullUrl?: string; // @workspace/p/urlname
  previewUrl?: string;  // Full url of preview-svg (including https://)
  description: string;
  useModeler?: boolean;
  isNewProcess?: boolean;
  userRights?: ProcessAccessRights; // Access rights of the current user
  attachments?: ProcessAttachment[];
  reportDrafts?: ProcessReportDraft[];
  processXmlHash?: string;
  userStartEvents?: StartButtonMap; // Map with starteventid -> start event name
  tags?: string[];
  rowDetails?: RowDetails[];
  hasWarnings?: boolean;
  latestCommentAt?: Date; // Datetime of the latest comment
  retentionPeriod?: number; // Retention period for insatances in months
  jumpsDisabled?: boolean;
  xmlVersion?: number;
  parentProcessIds?: string[];
  childProcessIds?: string[];
  extras: {
    // New Extras must be added to cache-handling in processactions -> loadProcess!
    bpmnXml?: string;
    bpmnProcess?: BpmnProcess; // Available if bpmnXml is available
    instances?: InstanceDetails[];
    instancesUsers?: UserDetails[];
    processRoles?: ProcessRoles;
    svgString?: string; // Only used to save preview to server or if requested in extras
    settings?: ProcessSettings;
    auditTrail?: AuditTrailEntry[];
    parentProcessDetails?: ProcessDetails[];
    childProcessDetails?: ProcessDetails[];
  };
}
export const gqlProcessTypes = `     
  type ExtrasProcess {
    bpmnXml: String
    instances: [InstanceDetails]
    processRoles: ProcessRoles
  }

  type ProcessAttachment {
    attachmentId: String
    fileName: String
    url: String
  }

  type ProcessDetails {
    workspaceId: String
    processId: String
    displayName: String
    urlName: String
    fullUrl: String
    previewUrl: String
    description: String
    useModeler: Boolean
    userRights: Int
    attachments: [ProcessAttachment]
    extras: ExtrasProcess
  }

  scalar PotentialRoleOwners
  scalar DecisionTask
  scalar ProcessRoles
`;

export const gqlProcessFragments = gql`
  fragment ProcessDetailsFields on ProcessDetails {
    processId
    urlName
    fullUrl
    displayName
    description
  }
`;

export interface ProcessSettings {
  dashboard?: {
    cardTitle?: string;  // Title of the cards in the dashboard
    cardDesc?: string;  // Additional text on the card
    dashBoardAccess?: ProcessViewAccess;  // Who can access todos?
  };
  library?: {
    rating?: number;  // Process rating, used to sort processes in library
    copiedFromId?: string;  // ProcessId of the original process
  };
}

export enum ProcessViewAccess {
  // DO NOT CHANGE NUMBERS - used in database
  EverybodySeesAll = 10,  // All todos/instances are public  NOT YET IMPLEMENTED
  // Not implemented because Dashboard uses user.extras.todos, which is not available for anonymous guests
  WorkspaceMembersSeeAll = 20,  // Team members see all todos/instances
  ParticipantsSeeAll = 30,  // Process participants see all todos/instances
  ParticipantsSeeTheirs = 40,  // Process participants see their own todos/instances
  OnlyProcessOwners = 50  // Only process managers can see todos/instances
}

export enum ProcessExtras {
  None = 0,
  ExtrasBpmnXml = 1 << 0,
  ExtrasInstances = 1 << 1,
  ExtrasProcessRolesWithMemberNames = 1 << 5, // Ermittelt zusätzlich die Namen der enthaltenen Mitglieder
  ExtrasSettings = 1 << 6,
  ExtrasAuditTrail = 1 << 7,
  ExtrasParentAndChildDetails = 1 << 8,
  ExtrasSvgString = 1 << 9
}

export interface TaskToLaneMapEntry {
  taskId: string;
  laneId: string;
}

export interface ModelValidationResult {
  isValid: boolean;
  tooManyOutgoings: string[];
  tooManyIncomings: string[];
}

export const ProcessResult = strEnum([
  "Ok",
  "Error"
]);
export type ProcessResult = keyof typeof ProcessResult;

export type TaskSettingsValueType = "List" | "Text" | "Boolean";

export type BpmnExtensionName =
  "description"
  | "processhub-userform" // Json: FieldDefinition[]
  | "send-task-receiver"
  | "send-task-with-field-contents" // Boolean: include field contents in SendTask notification mail?
  | "send-task-instance-link" // Boolean: include a link to the instance in SendTask notification mail?
  | "send-task-subject" // String: mail subject of SendTask notification mail
  | "all-fields-editable" // Boolean: all existing fields in task can be edited in current task
  | "view-all-fields" // Boolean: view all existing fields
  | "send-mail-notification" // Boolean: send notification for task
  | "set-sender-as-role-owner" // Boolean: set mail sender as role owner, default: true
  | "timer-start-configuration"
  | "required-fields-needed" // Boolean: means that the task needed previous required fields (not necessary on negative decisions)
  | "save-decision-in-fields"
  | "custom-field-contents-value"
  | "roleowners-editable" // Boolean: all role owners can be selected
  | "subprocessid" // Id of the process a SubProcess references,
  | "due-at-can-be-edit"
  | "due-at-duration"
  | "sequenceflow-expression"
  | "isBuilder-expression"
  | "fields-which-should-send"
  | "datefield-for-timercatch"
  | "script-task-code"
  | "service-task-config-object"
  | "roxtra-version";

export interface TaskExtensions {
  description: string;
  fieldDefinitions: FieldDefinition[];
  sendTaskReceiver: string[];
  sendTaskWithFieldContents: boolean;
  sendTaskInstanceLink: boolean;
  sendTaskSubject: string;
  allFieldsEditable: boolean;
  viewAllFields: boolean;
  sendMailNotification: boolean;
  requiredFieldsNeeded: TaskIdRequiredFieldsNeeded[];
  saveDecisionInFieldContents: boolean;
  customFieldContentsValue: string;
  dueAtDateCanBeEdit: boolean;
  dueAtDuration: string; // Standard dueAtDuration in seconds

  serviceTaskConfigObject: ServiceTaskConfigObject;
  scriptTaskCode: string;

  timerStartConfiguration: TimerStartEventConfiguration[];
  roleOwnersEditable: boolean;

  subProcessId: string;

  sequenceFlowExpression: string;
  isBuilderExpression: boolean;

  fieldsWhichShouldSend: string[];
  dateFieldTimer: string;
  roXtraVersion: string;
}

export interface TimerStartEventConfiguration {
  rowNumber: number;
  title: string;
  date: Date;
  time: string;
  frequency: Frequency;
  isTimeValid: boolean;
}

export enum Frequency {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
  Once = 5
}

export interface RunningTaskLane {
  bpmnTaskId: string;
  bpmnLaneId: string;
}

export interface StartButtonMap {
  [id: string]: {
    startEventName: string;
    laneId: string;
    onlyRoxFileField: boolean;
  };
}

export interface ServiceTaskConfigObject {
  selectedServiceId: string;
  selectedActionId: string;
  fields: ServiceActionConfigField[];
}

export interface ProcessDiagramSize {
  width: number;
  height: number;
}