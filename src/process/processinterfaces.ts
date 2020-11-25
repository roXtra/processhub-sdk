import { ProcessAccessRights, IProcessRoles } from "./processrights";
import { IInstanceDetails } from "../instance";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { strEnum } from "../tools/types";
import { IFieldDefinition, ITaskIdRequiredFieldsNeeded, IServiceActionConfigField } from "../data";
import { UserDetails } from "../user/userinterfaces";
import { IRowDetails } from ".";
import { IAuditTrailEntry } from "../audittrail/audittrailinterfaces";
import { IRiskManagementProcessSettings } from "../riskassessment/riskassessmentinterfaces";

export interface IProcessAttachment {
  attachmentId: string;
  fileName: string;
  url?: string; // Url must be set if it is an uploaded file
  roxFileId?: number; // RoxFileId must be set if the attachment is a link to a roXtra document
  iconLink?: string; // IconLink must be set if the attachment is a link to a roXtra document
}

export interface IProcessReportDraft {
  draftId: string;
  fileName: string;
  url: string;
}

/**
 * Describes the contents of the service.json file that is located in the services'
 */
export interface IServiceJson {
  id: string;
  minRoXtraVersion: string;
  maxRoXtraVersion: string;
  name: string;
  actions: IServiceActionConfig[];
}

export interface IServiceDetails extends IServiceJson {
  foldername: string;
}

export interface IServiceActionConfig {
  id: string;
  label: string;
  configMethod: string;
  settings: string;
  configElement: string;
  fields: IServiceActionField[];
  serviceFile: string;
  serviceMethod: string;
}

/**
 * Predefined functions that set the <select>-Elements options if type is "select"
 */
export type ServiceActionFieldOnloadFunction = "fields" | "reportDrafts" | "reportTypes" | "allProcesses";

export interface IServiceActionField {
  name: string;
  type: "select" | "text";
  onload: ServiceActionFieldOnloadFunction | string;
}

export interface IProcessDetails {
  processId: string;
  workspaceId: string;
  displayName: string;
  urlName?: string;
  previewUrl?: string; // Full url of preview-svg (including https://)
  description: string;
  useModeler?: boolean;
  isNewProcess?: boolean;
  userRights?: ProcessAccessRights; // Access rights of the current user
  attachments?: IProcessAttachment[];
  reportDrafts?: IProcessReportDraft[];
  processXmlHash?: string;
  userStartEvents?: IStartButtonMap; // Map with starteventid -> start event name
  tags?: string[];
  rowDetails?: IRowDetails[];
  hasWarnings?: boolean;
  latestCommentAt?: Date; // Datetime of the latest comment
  retentionPeriod?: number; // Retention period for insatances in months
  jumpsDisabled?: boolean;
  xmlVersion?: number;
  parentProcessIds?: string[];
  childProcessIds?: string[];
  riskManagementSettings?: IRiskManagementProcessSettings;
  instanceCount?: number;
  extras: {
    // New Extras must be added to cache-handling in processactions -> loadProcess!
    bpmnXml?: string;
    bpmnProcess?: BpmnProcess; // Available if bpmnXml is available
    instances?: IInstanceDetails[];
    instancesUsers?: UserDetails[];
    processRoles?: IProcessRoles;
    svgString?: string; // Only used to save preview to server or if requested in extras
    settings?: IProcessSettings;
    auditTrail?: IAuditTrailEntry[];
    parentProcessDetails?: IProcessDetails[];
    childProcessDetails?: IProcessDetails[];
  };
}

export interface IProcessSettings {
  dashboard?: {
    cardTitle?: string; // Title of the cards in the dashboard
    cardDesc?: string; // Additional text on the card
    dashBoardAccess?: ProcessViewAccess; // Who can access todos?
  };
  library?: {
    copiedFromId?: string; // ProcessId of the original process
  };
  riskManagement?: {
    probabilityValues: string[]; // Possible values to rate the probability, starting with the least probable one
    severityValues: string[]; // Possible values to rate the severity, starting with the least serious one
  };
}

export enum ProcessViewAccess {
  // DO NOT CHANGE NUMBERS - used in database
  EverybodySeesAll = 10, // All todos/instances are public  NOT YET IMPLEMENTED
  // Not implemented because Dashboard uses user.extras.todos, which is not available for anonymous guests
  WorkspaceMembersSeeAll = 20, // Team members see all todos/instances
  ParticipantsSeeAll = 30, // Process participants see all todos/instances
  ParticipantsSeeTheirs = 40, // Process participants see their own todos/instances
  OnlyProcessOwners = 50, // Only process managers can see todos/instances
}

export enum ProcessExtras {
  None = 0,
  ExtrasBpmnXml = 1 << 0,
  ExtrasInstances = 1 << 1,
  ExtrasProcessRolesWithMemberNames = 1 << 5, // Ermittelt zusätzlich die Namen der enthaltenen Mitglieder
  ExtrasSettings = 1 << 6,
  ExtrasAuditTrail = 1 << 7,
  ExtrasParentAndChildDetails = 1 << 8,
  ExtrasSvgString = 1 << 9,
}

export interface ITaskToLaneMapEntry {
  taskId: string;
  laneId: string;
}

export interface IModelValidationResult {
  isValid: boolean;
  tooManyOutgoings: string[];
  tooManyIncomings: string[];
}

export const ProcessResult = strEnum(["Ok", "Error"]);
export type ProcessResult = keyof typeof ProcessResult;

export type TaskSettingsValueType = "List" | "Text" | "Boolean";

export type BpmnExtensionName =
  | "description"
  | "processhub-userform" // Json: FieldDefinition[]
  | "send-task-receiver"
  | "send-task-with-field-contents" // Boolean: include field contents in SendTask notification mail?
  | "send-task-instance-link" // Boolean: include a link to the instance in SendTask notification mail?
  | "send-task-subject" // String: mail subject of SendTask notification mail
  | "all-fields-editable" // Boolean: all existing fields in task can be edited in current task
  | "view-all-fields" // Boolean: view all existing fields
  | "send-mail-notification" // Boolean: send notification for task
  | "set-sender-as-role-owner" // Boolean: set mail sender as role owner, default: true
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
  | "roxtra-version"
  | "anonymous-start"
  | "anonymous-start-userid"
  | "message-event-type"; // "mail" | "webhook"

export interface ITaskExtensions {
  description?: string;
  fieldDefinitions?: IFieldDefinition[];
  sendTaskReceiver?: string[];
  sendTaskWithFieldContents: boolean;
  sendTaskInstanceLink: boolean;
  sendTaskSubject?: string;
  allFieldsEditable: boolean;
  viewAllFields: boolean;
  sendMailNotification: boolean;
  requiredFieldsNeeded?: ITaskIdRequiredFieldsNeeded[];
  saveDecisionInFieldContents: boolean;
  customFieldContentsValue?: string;
  dueAtDateCanBeEdit: boolean;
  dueAtDuration?: string; // Standard dueAtDuration in seconds

  serviceTaskConfigObject?: IServiceTaskConfigObject;
  scriptTaskCode?: string;

  roleOwnersEditable: boolean;

  subProcessId?: string;

  sequenceFlowExpression?: string;
  isBuilderExpression: boolean;

  fieldsWhichShouldSend?: string[];
  dateFieldTimer?: string;
  roXtraVersion?: string;

  anonymousStart?: boolean;
  anonymousStartUserId?: string;

  messageEventType?: string;
}

export interface ITimerStartEventConfiguration {
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
  Once = 5,
}

export interface IRunningTaskLane {
  bpmnTaskId: string;
  bpmnLaneId: string;
}

export interface IStartButtonMap {
  [id: string]: {
    startEventName?: string;
    laneId: string;
    onlyRoxFileField: boolean;
    anonymousStart?: boolean;
  };
}

export interface IServiceTaskConfigObject {
  selectedServiceId: string;
  selectedActionId: string;
  fields: IServiceActionConfigField[];
}

export interface IProcessDiagramSize {
  width: number;
  height: number;
}
