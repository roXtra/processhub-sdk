import { ProcessAccessRights, IProcessRoles } from "./processrights.js";
import { BpmnProcess } from "./bpmn/bpmnprocess.js";
import { strEnum } from "../tools/types.js";
import { AuditTrailEntry } from "../audittrail/audittrailentry.js";
import { IRiskManagementProcessSettings } from "../riskassessment/riskassessmentinterfaces.js";
import { IGenericModuleSettings } from "../modules/imodule.js";
import { IRowDetails } from "./phclient.js";
import { IFieldDefinition } from "../data/ifielddefinition.js";
import { IServiceActionConfigField, ITaskIdRequiredFieldsNeeded } from "../data/datainterfaces.js";
import { FieldType } from "../data/ifieldvalue.js";
import { IInstanceDetails } from "../instance/instanceinterfaces.js";
import IAuditsSettings from "../modules/audits/iauditssettings.js";

export interface IProcessAttachment {
  attachmentId: string;
  fileName: string;
  url?: string; // Url must be set if it is an uploaded file
  roxFileId?: number; // RoxFileId must be set if the attachment is a link to a roXtra document
  /**
   * @deprecated use mimeTypeIcon
   */
  iconLink?: string;
  /**
   * File name of the mime type icon without URL/hostname (eg "docx.svg")
   * Must be set if the attachment is a link to a roXtra document
   */
  mimeTypeIcon?: string;
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
  // Includes ServiceActionFieldOnloadFunction
  onload: string;
}

/**
 * Base information for subprocesses / parent processes
 */
export interface ISubParentBaseProcessInformation {
  processId: string;
  workspaceId: string;
  displayName: string;
  urlName: string;
  archived: boolean; // True, if the process is archived, false or undefined otherwise
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
  statisticsReportDrafts?: IProcessReportDraft[];
  processXmlHash?: string;
  userStartEvents?: IStartButtonMap; // Map with starteventid -> start event name
  tags?: string[];
  rowDetails?: IRowDetails[];
  hasWarnings?: boolean;
  latestCommentAt?: Date; // Datetime of the latest comment
  retentionPeriod?: number; // Retention period for insatances in months
  deletionPeriod?: number; // Deletion period for insatances in months
  jumpsDisabled?: boolean;
  xmlVersion?: number;
  parentProcessIds?: string[];
  parentProcesses?: {
    parentProcessDisplayName: string;
    parentProcessId: string;
    startEventId: string;
  }[];
  childProcessIds?: string[];
  riskManagementSettings?: IRiskManagementProcessSettings;
  genericModuleSettings?: IGenericModuleSettings;
  auditsSettings?: IAuditsSettings;
  instanceCount?: number;
  archived?: boolean; // True, if the process is archived, false or undefined otherwise
  reactivateTaskId?: string; // The usertask ID that is used for reactivating instances
  extras: {
    // New Extras must be added to cache-handling in processactions -> loadProcess!
    bpmnXml?: string;
    bpmnProcess?: BpmnProcess; // Available if bpmnXml is available
    instances?: IInstanceDetails[];
    processRoles?: IProcessRoles;
    svgString?: string; // Only used to save preview to server or if requested in extras
    settings?: IProcessSettings;
    auditTrail?: AuditTrailEntry[];
    parentProcessDetails?: ISubParentBaseProcessInformation[];
    childProcessDetails?: ISubParentBaseProcessInformation[];
  };
  type: "backend";
}

export interface IRetentionPeriodLock {
  locked: boolean;
  reason?: string;
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
  retentionPeriodLock?: IRetentionPeriodLock; // Retention Period Object including reason and locked state
}

export enum ProcessViewAccess {
  // DO NOT CHANGE NUMBERS - used in database
  // Not implemented because Dashboard uses user.extras.todos, which is not available for anonymous guests
  WorkspaceMembersSeeAll = 20, // Team members see all todos/instances
  ParticipantsSeeTheirs = 40, // Process participants see their own todos/instances
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
  ExtrasRunningInstances = 1 << 10,
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
  | "allow-task-claim" // Boolean: task can be claimed by potential roleowners
  | "send-mail-notification" // Boolean: send notification for task
  | "set-sender-as-role-owner" // Boolean: set mail sender as role owner, default: true
  | "required-fields-needed" // Boolean: means that the task needed previous required fields (not necessary on negative decisions)
  | "save-decision-in-fields"
  | "custom-field-contents-value"
  | "roleowners-editable" // Boolean: all role owners can be selected
  | "subprocessid" // Id of the process a SubProcess references,
  | "subprocess-fieldmapping"
  | "subprocess-starteventid"
  | "due-at-can-be-edit"
  | "due-at-duration"
  | "sequenceflow-expression"
  | "isBuilder-expression"
  | "fields-which-should-send"
  | "attachmentfields-which-should-send" // Fileuploadfields that should be sent as attachments in sendtask
  | "datefield-for-timercatch"
  | "daterangefield-for-timercatch" // String:
  | "script-task-code"
  | "script-task-code-objects"
  | "service-task-config-object"
  | "roxtra-version"
  | "anonymous-start"
  | "anonymous-start-userid"
  | "message-event-type" // "mail" | "webhook" | "bus"
  | "mail-body-parse-fields" // Boolean: parse fields from mail body in StartEvent/IntermediateEvent with MessageEventDefinition, default: false
  | "webhook-body-to-field" // Boolean: write the body of the webhook request inside a field with the name of the event id
  | "busevent-types" // Array<string>: bus event types that trigger the event
  | "signalcatchevent-roles" // Array<string>: The lanes that are allowed to trigger a SignalCatch event - if not defined or empty, the current role owner is allowed
  | "copy-fields" // Boolean, can be set for StartEvent. Allows to copy the field values defined in the StartEvent from another instance
  | "linked-doc-types" // Doc types that are linked to the process for internal workflow processes.
  | "busmessage-type" // String: The type of the bus message that is sent by a message throw event (namespace + interface)
  | "mail-attachment-field" // String: process field where the mail attachments from mail related events are stored
  | "mail-start-event-content" // Object that contains subject, sender and body of mail
  | "todo-sign" // Boolean: Requires to enter the user credentials to complete the todo preceding the sequence flow
  | "enable-gxp"; // Boolean: can be set in addition to the todo sign functionality to enforce compliance policies

export interface ITaskExtensions {
  description?: string;
  fieldDefinitions?: IFieldDefinition[];
  sendTaskReceiver?: string[];
  sendTaskWithFieldContents: boolean;
  sendTaskInstanceLink: boolean;
  sendTaskSubject?: string;
  sendTaskAttachmentFields?: string[];
  allFieldsEditable: boolean;
  viewAllFields: boolean;
  allowTaskClaim: boolean;
  sendMailNotification: boolean;
  requiredFieldsNeeded?: ITaskIdRequiredFieldsNeeded[];
  saveDecisionInFieldContents: boolean;
  customFieldContentsValue?: string;
  dueAtDateCanBeEdit: boolean;
  dueAtDuration?: string; // Standard dueAtDuration in seconds

  serviceTaskConfigObject?: IServiceTaskConfigObject;
  scriptTaskCode?: string;
  scriptTaskCodeObjects: IScriptTaskCodeObject[];

  roleOwnersEditable: boolean;

  subProcessId?: string;
  subProcessFieldMapping: ISubProcessFieldMapping[];
  subProcessStartEventId?: string;

  sequenceFlowExpression?: string;
  isBuilderExpression: boolean;
  todoSign?: boolean; // Requires to enter the user credentials to complete the todo preceding the sequence flow
  enableGxp?: boolean; // Can be set in addition to the todo sign functionality to enforce compliance policies

  fieldsWhichShouldSend?: string[];
  dateFieldTimer?: string;
  dateRangeOptionForTimer?: string; // "start" | "end" - Part of the date range as trigger for the timer
  roXtraVersion?: string;

  anonymousStart?: boolean;
  anonymousStartUserId?: string;

  messageEventType?: string; // "mail" | "webhook" | "bus" - defaults to mail if not explicitely set
  mailBodyParseFields?: boolean;
  webhookBodyToField?: boolean;
  busEventTypes?: string[];

  signalCatchEventRoles: string[] | undefined; // The lanes that are allowed to trigger a SignalCatch event - if not defined or empty, the current role owner is allowed
  copyFields?: boolean; // Allows to copy the field values defined in the StartEvent from another instance
  linkedDocTypes?: ILinkedDocTypes; // Doc types that are linked to the process for internal workflow processes.

  busMessageType?: string; // String: The type of the bus message that is sent by a message throw event (namespace + interface)
  mailAttachmentField?: string; // String: process field where the mail attachments from mail related events are stored
  mailStartEventContent?: IMailStartEventContent; // Object that contains subject, sender and body of mail
}

export interface ITimerStartEventConfiguration {
  title: string;
  date: Date;
  frequency: Frequency;
  isTimeValid: boolean;
  isNewTimer: boolean;
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

export interface ISubProcessFieldMapping {
  in: { name: string; type: FieldType } | undefined;
  out: { name: string; type: FieldType } | undefined;
  subProcessField: { name: string; type: FieldType } | undefined;
  id: string;
}

export interface ILinkedDocTypes {
  allDocTypes: boolean;
  // Must be specified if allDocTypes is false
  docTypeIds?: Array<number>;
}

export type ScriptTaskOperation = "clear" | "set" | "add";

export interface IScriptTaskCodeObject {
  field?: string;
  operator?: ScriptTaskOperation;
  value?: string;
}

export interface IMailStartEventContent {
  senderMail?: string;
  subject?: string;
  body?: string;
  replyTo?: string;
}
