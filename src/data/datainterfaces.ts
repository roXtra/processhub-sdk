import { IInstanceEnvironment } from "../environment";
import { BpmnProcess } from "../process";
import { IInstanceDetails, IRiskAssessmentValue } from "../instance/instanceinterfaces";
import { UserDetails } from "../user";
import { Process } from "..";

export interface IFieldDefinition {
  name: string;
  type: FieldType;
  isRequired: boolean;
  config: {};
}

export interface IFieldDefinitionItem {
  bpmnTaskId: string;
  isStartEvent: boolean;
  fieldDefinition: IFieldDefinition;
}

export interface ITaskIdRequiredFieldsNeeded {
  taskId: string;
  requiredFieldsNeeded: boolean;
}

export interface IRoxFileFieldValue {
  url: string;
  lockedAt: Date;
  lockedByUserName: string;
  lockedByUserId: string;
}

export interface ISignatureFieldValue {
  svgDataUrl: string;
  dataPoints: {};
}

export interface IServiceActionConfigField {
  key: string;
  type: string;
  value: string;
}

export type FieldValueType =
  number | // Number
  Date | // Date
  string | // TextInput, TextArea, RoleOwner
  boolean | // Checkbox
  string[] | // FileUpload
  IRoxFileFieldValue | // RoxFile
  ISignatureFieldValue | // Signature
  { [key: string]: boolean } | // Checklist
  IRiskAssessmentValue; // RiskAssesment

export interface IFieldValue {
  type: FieldType;
  value: FieldValueType;
}

export type FieldType =
  "ProcessHubTextInput"
  | "ProcessHubDateTime"
  | "ProcessHubTextArea"
  | "ProcessHubInstanceTitle"
  | "ProcessHubCheckbox"
  | "ProcessHubFileUpload"
  | "ProcessHubRoleOwner"
  | "ProcessHubDate"
  | "ProcessHubDropdown"
  | "ProcessHubChecklist"
  | "ProcessHubDecision"
  | "ProcessHubRoxFile"
  | "ProcessHubSignature"
  | "ProcessHubLabel"
  | "ProcessHubMail"
  | "ProcessHubNumber"
  | "ProcessHubRiskAssessment";

export interface IFieldType {
  getType(): FieldType;
  getName(): string;
  getInput(props: IFormElementProps, instanceEnv: IInstanceEnvironment, bpmnProcess: BpmnProcess, onFieldValueChanged: () => void, showInvalidFields: boolean, startEventId?: string): JSX.Element;
  renderValue(value: {}, instance: IInstanceDetails): JSX.Element;
  renderValueForEmail(value: {}, instance: IInstanceDetails): JSX.Element;
  getSettingsButton(fieldDefinition: IFieldDefinition, onConfigChanged: (fieldDefinition: IFieldDefinition) => void, bpmnProcess: Process.BpmnProcess): JSX.Element;
  isVisible(): boolean;
  isValid(fieldDefinition: IFieldDefinition, instanceEnv: IInstanceEnvironment): boolean;
  isConfigValid(fieldDefinition: IFieldDefinition): { valid: boolean; message?: string };
}

export interface IFormElementProps {
  value: FieldValueType;
  label: string;
  required: boolean;
  disabled: boolean;
  config: {};
  key?: string;
}


/**
 * Check if an element implements the FieldValue interface
 * @param element element to check
 * @return {boolean} true, if element implements the FieldValue interface, false otherwise
 */
export function isFieldValue(element: {}): element is IFieldValue {
  return element
    && (element as IFieldValue).type != undefined
    && typeof (element as IFieldValue).type === "string";
}

export interface IFieldContentMap {
  [fieldId: string]: string | boolean | IFieldValue;
}

// Returns the name of the best fitting Semantic UI icon for the specified file name
export function getFiletypeIcon(filename: string): string {
  if (filename == null || filename.length === 0)
    return "file outline";

  const extension = filename.split(".").last().toLowerCase();

  switch (extension) {
    case "pdf":
      return "file pdf outline";
    case "xls":
    case "xlsx":
      return "file excel outline";
    case "doc":
    case "docx":
      return "file word outline";
    case "ppt":
    case "pptx":
      return "file powerpoint outline";
    case "zip":
    case "tar.gz":
      return "file archive outline";
    case "txt":
      return "file text outline";
    case "jpg":
    case "png":
    case "gif":
    case "svg":
      return "file image outline";
    default:
      return "file outline";
  }
}


/* Interfaces for statistics */
export enum StatisticsAction {
  // Process
  processCreated = 1,
  processEdited = 2,
  processDeleted = 3,

  // Instance
  instanceStarted = 10,
  instanceAborted = 11,
  instanceIncomingMail = 12,
  instanceOutgoingMail = 13,
  instanceJumped = 14,

  // Todo
  todoCreated = 20,
  todoCompleted = 21,
  todoUpdated = 22,
  todoExecuted = 23,
  todoWithDecision = 24,
  todoDeleted = 25,

  // User
  userComment = 30,
}

export interface IStatisticTrailEntry {
  todo?: { todoId?: string; bpmnTaskId: string; bpmnLaneId: string; desicionTaskBpmnTaskId?: string; timeOverDueDate?: number };
  instance?: { instanceId: string; jumpToBpmnTask?: string };
  user?: { instanceId: string };
  process?: {};
}

export interface IStatisticRow {
  statisticsId: string;
  workspaceId: string;
  processId: string;
  details: IStatisticTrailEntry;
  action: StatisticsAction;
  userDetails: UserDetails;
  userId: string;
  createdAt: Date;
}

export interface IHeatmapDatapoint {
  bpmnElementId: string;
  value: number;
}