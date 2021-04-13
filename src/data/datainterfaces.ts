import { IInstanceEnvironment } from "../environment";
import {
  IInstanceDetails,
  IRiskAssessmentTargetValue,
  IRiskAssessmentTargetValueSchema,
  IRiskAssessmentValue,
  IRiskAssessmentValueSchema,
  State,
  StateSchema,
} from "../instance/instanceinterfaces";
import { IUserDetails } from "../user";
import { Process, ActionHandler } from "..";
import { RiskAssessmentCycle, RiskAssessmentCycleSchema } from "../riskassessment/riskassessmentinterfaces";
import { IProcessDetails } from "../process";
import Joi from "joi";
import { Component } from "react";

export const FieldTypeOptions = [
  "ProcessHubTextInput",
  "ProcessHubDateTime",
  "ProcessHubTextArea",
  "ProcessHubInstanceTitle",
  "ProcessHubFileUpload",
  "ProcessHubRoleOwner",
  "ProcessHubDate",
  "ProcessHubDropdown",
  "ProcessHubChecklist",
  "ProcessHubRadioButton",
  "ProcessHubDecision",
  "ProcessHubRoxFile",
  "ProcessHubSignature",
  "ProcessHubLabel",
  "ProcessHubMail",
  "ProcessHubNumber",
  "ProcessHubRiskAssessment",
  "ProcessHubRiskAssessmentTodos",
  "ProcessHubRiskAssessmentCycle",
  "ProcessHubRiskAssessmentTarget",
  "ProcessHubSpreadSheet",
  "ProcessHubProcessLink",
  "ProcessHubInstanceNumber",
  "ProcessHubRoxFileLink",
  "ProcessHubCalculatedField",
] as const;

export type FieldType = typeof FieldTypeOptions[number];

export function createLiteralTypeRegExp(literalTypeOptions: string[]): RegExp {
  let regExpString = "";

  for (const typeOption of literalTypeOptions) {
    if (typeof typeOption === "string") {
      regExpString += "^" + typeOption + "$|";
    } else {
      throw new Error("Error: Type option is not a string!");
    }
  }

  // Remove last "|"
  regExpString = regExpString.substring(0, regExpString.length - 1);

  return new RegExp(regExpString);
}

export const FieldTypeSchema = Joi.string().pattern(createLiteralTypeRegExp(Object.values(FieldTypeOptions)));

export class IFieldConfig {
  conditionExpression: string | undefined;
  conditionBuilderMode?: boolean;
}

const IFieldConfigObject: IFieldConfig = {
  conditionExpression: (Joi.string().allow("") as unknown) as string,
  conditionBuilderMode: (Joi.boolean() as unknown) as boolean,
};

export const IFieldConfigSchema = Joi.object(IFieldConfigObject);

export interface IFieldDefinition {
  name: string;
  type: FieldType;
  isRequired: boolean;
  isRestricted?: boolean;
  // Is it allowed to edit the field config directly from a running instance (for process managers)?
  inlineEditingActive: boolean | undefined;
  config: IFieldConfig;
}

const IFieldDefinitionObject: IFieldDefinition = {
  name: (Joi.string().allow("").required() as unknown) as string,
  type: (FieldTypeSchema as unknown) as FieldType,
  isRequired: (Joi.boolean().required() as unknown) as boolean,
  isRestricted: (Joi.boolean() as unknown) as boolean,
  inlineEditingActive: (Joi.boolean() as unknown) as boolean,
  config: (IFieldConfigSchema as unknown) as IFieldConfig,
};

export const IFieldDefinitionSchema = Joi.object(IFieldDefinitionObject);

export interface IFieldDefinitionItem {
  bpmnTaskId: string;
  isStartEvent: boolean;
  fieldDefinition: IFieldDefinition;
}

const IFieldDefinitionItemObject: IFieldDefinitionItem = {
  bpmnTaskId: (Joi.string().allow("").required() as unknown) as string,
  isStartEvent: (Joi.boolean().required() as unknown) as boolean,
  fieldDefinition: (IFieldDefinitionSchema as unknown) as IFieldDefinition,
};

export const IFieldDefinitionItemSchema = Joi.object(IFieldDefinitionItemObject);

export interface ITaskIdRequiredFieldsNeeded {
  taskId: string;
  requiredFieldsNeeded: boolean;
}

const ITaskIdRequiredFieldsNeededObject: ITaskIdRequiredFieldsNeeded = {
  taskId: (Joi.string().allow("").required() as unknown) as string,
  requiredFieldsNeeded: (Joi.boolean().required() as unknown) as boolean,
};

export const ITaskIdRequiredFieldsNeededSchema = Joi.object(ITaskIdRequiredFieldsNeededObject);

export interface IRoxFileFieldValue {
  url?: string;
  lockedAt?: Date;
  lockedByUserName?: string;
  lockedByUserId?: string;
}

const IRoxFileFieldValueObject: IRoxFileFieldValue = {
  url: (Joi.string().allow("") as unknown) as string,
  lockedAt: (Joi.date() as unknown) as Date,
  lockedByUserName: (Joi.string().allow("") as unknown) as string,
  lockedByUserId: (Joi.string().allow("") as unknown) as string,
};

export const IRoxFileFieldValueSchema = Joi.object(IRoxFileFieldValueObject);

export interface ISignatureFieldValue {
  svgDataUrl: string | undefined;
  dataPoints: {} | undefined;
}

const ISignatureFieldValueObject: ISignatureFieldValue = {
  svgDataUrl: (Joi.string().allow("") as unknown) as string,
  dataPoints: (Joi.object() as unknown) as {},
};

export const ISignatureFieldValueSchema = Joi.object(ISignatureFieldValueObject);

export interface IRadioButtonFieldValue {
  name: string;
}

const IRadioButtonFieldValueObject: IRadioButtonFieldValue = {
  name: (Joi.string().allow("").required() as unknown) as string,
};

export const IRadioButtonFieldValueSchema = Joi.object(IRadioButtonFieldValueObject);

export interface IRadioButtonGroupFieldValue {
  radioButtons: IRadioButtonFieldValue[];
  selectedRadio: number | undefined;
}

const IRadioButtonGroupFieldValueObject: IRadioButtonGroupFieldValue = {
  radioButtons: (Joi.array().items(Joi.object(IRadioButtonFieldValueObject)).required() as unknown) as IRadioButtonFieldValue[],
  selectedRadio: (Joi.number() as unknown) as number,
};

export const IRadioButtonGroupFieldValueSchema = Joi.object(IRadioButtonGroupFieldValueObject);

export interface ISpreadSheetFieldValue {
  // "fileUrl" is defined for all SpreadSheet fields were the value is saved in the file system and not in the DB
  fileUrl: string | undefined;
  url: string;
  value: {} | undefined;
}

const ISpreadSheetFieldValueObject: ISpreadSheetFieldValue = {
  fileUrl: (Joi.string().allow("").required() as unknown) as string,
  url: (Joi.string().allow("").required() as unknown) as string,
  value: (Joi.object().required() as unknown) as {},
};

export const ISpreadSheetFieldValueSchema = Joi.object(ISpreadSheetFieldValueObject);

export type IRoxFileLinkValue = {
  roxFileName: string | undefined;
  roxFileId: number;
  roxFileIconUrl: string | undefined;
}[];

const IRoxFileLinkValueObject: {
  roxFileName: string | undefined;
  roxFileId: number;
  roxFileIconUrl: string | undefined;
} = {
  roxFileName: (Joi.string().allow("") as unknown) as string,
  roxFileId: (Joi.number().required() as unknown) as number,
  roxFileIconUrl: (Joi.string().allow("") as unknown) as string,
};

export const IRoxFileLinkValueSchema = Joi.array().items(Joi.object(IRoxFileLinkValueObject));

export interface IProcessLinkInstance {
  instanceId: string;
  workspaceId: string;
  title: string | undefined;
  moduleId: number;
  state: State | undefined;
}

const IProcessLinkInstanceObject: IProcessLinkInstance = {
  instanceId: (Joi.string().allow("").required() as unknown) as string,
  workspaceId: (Joi.string().allow("").required() as unknown) as string,
  title: (Joi.string().allow("") as unknown) as string,
  moduleId: (Joi.number().required() as unknown) as number,
  state: (StateSchema as unknown) as State,
};

export const IProcessLinkInstanceSchema = Joi.object(IProcessLinkInstanceObject);

export interface IProcessLinkValue {
  linkedInstances: IProcessLinkInstance[];
}

const IProcessLinkValueObject: IProcessLinkValue = {
  linkedInstances: (Joi.array().items(Joi.object(IProcessLinkInstanceObject)).required() as unknown) as IProcessLinkInstance[],
};

export const IProcessLinkValueSchema = Joi.object(IProcessLinkValueObject);

export interface IServiceActionConfigField {
  key: string;
  type: string;
  value: string;
}

const IServiceActionConfigFieldObject: IServiceActionConfigField = {
  key: (Joi.string().allow("").required() as unknown) as string,
  type: (Joi.string().allow("").required() as unknown) as string,
  value: (Joi.string().allow("").required() as unknown) as string,
};

export const IServiceActionConfigFieldSchema = Joi.object(IServiceActionConfigFieldObject);

export interface IChecklistEntry {
  name: string;
}

const IChecklistEntryObject: IChecklistEntry = {
  name: (Joi.string().allow("").required() as unknown) as string,
};

export const IChecklistEntrySchema = Joi.object(IChecklistEntryObject);

export type ChecklistFieldValue = { [key: string]: boolean };

export const ChecklistFieldValueSchema = Joi.object().pattern(Joi.string().allow(""), Joi.boolean());

export interface IFieldConfigDefault extends IFieldConfig {
  validationExpression?: string;
  defaultValue?: string | Date | ChecklistFieldValue | IRadioButtonGroupFieldValue | ISpreadSheetFieldValue | IRoxFileLinkValue;
}

const IFieldConfigDefaultObject: IFieldConfigDefault = {
  validationExpression: (Joi.string().allow("") as unknown) as string,
  defaultValue: ([
    Joi.string().allow(""),
    Joi.date(),
    ChecklistFieldValueSchema,
    IRadioButtonGroupFieldValueSchema,
    ISpreadSheetFieldValueSchema,
    IRoxFileLinkValueSchema,
  ] as unknown) as string,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IFieldConfigDefaultSchema = Joi.object(IFieldConfigDefaultObject);

export interface IChecklistFieldConfig extends IFieldConfigDefault {
  entries: IChecklistEntry[];
  oneEntryMustBeChecked: boolean;
}

const IChecklistFieldConfigObject: IChecklistFieldConfig = {
  entries: (Joi.array().items(Joi.object(IChecklistEntryObject)).required() as unknown) as IChecklistEntry[],
  oneEntryMustBeChecked: (Joi.boolean().required() as unknown) as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IChecklistFieldConfigSchema = Joi.object(IChecklistFieldConfigObject);

export type IDateFieldConfig = IFieldConfigDefault;

export const IDateFieldConfigSchema = Joi.object(IFieldConfigDefaultObject);

export interface IDropdownFieldConfig extends IFieldConfigDefault {
  options: string[];
}

const IDropdownFieldConfigObject: IDropdownFieldConfig = {
  options: (Joi.array().items(Joi.string().allow("")).required() as unknown) as string[],
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IDropdownFieldConfigSchema = Joi.object(IDropdownFieldConfigObject);

export interface IFileUploadFieldConfig extends IFieldConfig {
  validationExpression?: string;
}

const IFileUploadFieldConfigObject: IFileUploadFieldConfig = {
  validationExpression: (Joi.string().allow("") as unknown) as string,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IFileUploadFieldConfigSchema = Joi.object(IFileUploadFieldConfigObject);

export interface IInstanceTitleFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
}

const IInstanceTitleFieldConfigObject: IInstanceTitleFieldConfig = {
  evalDefaultValue: (Joi.boolean().required() as unknown) as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IInstanceTitleFieldConfigSchema = Joi.object(IInstanceTitleFieldConfigObject);

export interface ILabelConfig extends IFieldConfig {
  labelHtml?: string;
}

const ILabelConfigObject: ILabelConfig = {
  labelHtml: (Joi.string().allow("") as unknown) as string,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const ILabelConfigSchema = Joi.object(ILabelConfigObject);

export type IMailFieldConfig = IFieldConfigDefault;

export const IMailFieldConfigSchema = Joi.object(IFieldConfigDefaultObject);

export interface INumberFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
  onlyIntegers: boolean;
}

const INumberFieldConfigObject: INumberFieldConfig = {
  evalDefaultValue: (Joi.boolean().required() as unknown) as boolean,
  onlyIntegers: (Joi.boolean().required() as unknown) as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const INumberFieldConfigSchema = Joi.object(INumberFieldConfigObject);

export interface IRadioButtonGroupEntry {
  name: string;
  value: number;
  selected: boolean;
}

const IRadioButtonGroupEntryObject: IRadioButtonGroupEntry = {
  name: (Joi.string().allow("").required() as unknown) as string,
  value: (Joi.number().required() as unknown) as number,
  selected: (Joi.boolean().required() as unknown) as boolean,
};

export const IRadioButtonGroupEntrySchema = Joi.object(IRadioButtonGroupEntryObject);

export interface IRadioButtonFieldConfig extends IFieldConfigDefault {
  entries: IRadioButtonGroupEntry[];
  oneEntryMustBeChecked: boolean;
}

const IRadioButtonFieldConfigObject: IRadioButtonFieldConfig = {
  entries: (Joi.array().items(Joi.object(IRadioButtonGroupEntryObject)).required() as unknown) as IRadioButtonGroupEntry[],
  oneEntryMustBeChecked: (Joi.boolean().required() as unknown) as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IRadioButtonFieldConfigSchema = Joi.object(IRadioButtonFieldConfigObject);

export interface IRiskAssessmentFieldConfig extends IFieldConfig {
  validationExpression: string | undefined;
}

const IRiskAssessmentFieldConfigObject: IRiskAssessmentFieldConfig = {
  validationExpression: (Joi.string().allow("") as unknown) as string,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IRiskAssessmentFieldConfigSchema = Joi.object(IRiskAssessmentFieldConfigObject);

const IRoleOwnerFieldConfigDefaultValueOptions = ["NoValue", "CurrentUser"] as const;

type IRoleOwnerFieldConfigDefaultValueType = typeof IRoleOwnerFieldConfigDefaultValueOptions[number];

export interface IRoleOwnerFieldConfig extends IFieldConfig {
  validationExpression?: string;
  defaultValue: IRoleOwnerFieldConfigDefaultValueType | undefined;
}

const IRoleOwnerFieldConfigObject: IRoleOwnerFieldConfig = {
  validationExpression: (Joi.string().allow("") as unknown) as string,
  defaultValue: (Joi.string().pattern(createLiteralTypeRegExp(Object.values(IRoleOwnerFieldConfigDefaultValueOptions))) as unknown) as IRoleOwnerFieldConfigDefaultValueType,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IRoleOwnerFieldConfigSchema = Joi.object(IRoleOwnerFieldConfigObject);

export interface IRoxFileFieldConfig extends IFieldConfig {
  validationExpression: string | undefined;
  roxFileName: string | undefined;
  roxFileId: number | undefined;
  roxFileIconUrl: string | undefined;
}

const IRoxFileFieldConfigObject: IRoxFileFieldConfig = {
  validationExpression: (Joi.string().allow("") as unknown) as string,
  roxFileName: (Joi.string().allow("") as unknown) as string,
  roxFileId: (Joi.number() as unknown) as number,
  roxFileIconUrl: (Joi.string().allow("") as unknown) as string,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IRoxFileFieldConfigSchema = Joi.object(IRoxFileFieldConfigObject);

export type ISignatureFieldConfig = IFieldConfig;

export const ISignatureFieldConfigSchema = Joi.object(IFieldConfigObject);

export type ISpreadSheetFieldConfig = IFieldConfigDefault;

export const ISpreadSheetFieldConfigSchema = Joi.object(IFieldConfigDefaultObject);

export interface ITextAreaFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
}

const ITextAreaFieldConfigObject: ITextAreaFieldConfig = {
  evalDefaultValue: (Joi.boolean().required() as unknown) as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const ITextAreaFieldConfigSchema = Joi.object(ITextAreaFieldConfigObject);

export interface ITextInputFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
}

const ITextInputFieldConfigObject: ITextInputFieldConfig = {
  evalDefaultValue: (Joi.boolean().required() as unknown) as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const ITextInputFieldConfigSchema = Joi.object(ITextInputFieldConfigObject);

export type FieldValueType =
  | number // Number
  | Date // Date
  | string // TextInput, TextArea, RoleOwner
  | string[] // FileUpload
  | IRoxFileFieldValue // RoxFile
  | ISignatureFieldValue // Signature
  | { [key: string]: boolean } // Checklist
  | IRadioButtonGroupFieldValue // RadioButtonGroup
  | ISpreadSheetFieldValue // SpreadSheet
  | IRiskAssessmentValue // RiskAssesment
  | RiskAssessmentCycle // RiskAssessmentCycle
  | IProcessLinkValue // ProcessLink
  | IRoxFileLinkValue // RoxFileLink
  | IRiskAssessmentTargetValue;

const FieldValueTypeSchema = [
  Joi.allow(null),
  Joi.number(),
  Joi.date(),
  Joi.string().allow(""),
  Joi.array().items(Joi.string().allow("")),
  IRoxFileFieldValueSchema,
  ISignatureFieldValueSchema,
  Joi.object().pattern(Joi.string(), Joi.boolean()), // Schema of type { [key: string]: boolean }
  IRadioButtonGroupFieldValueSchema,
  ISpreadSheetFieldValueSchema,
  IRiskAssessmentValueSchema,
  RiskAssessmentCycleSchema,
  IProcessLinkValueSchema,
  IRoxFileLinkValueSchema,
  IRiskAssessmentTargetValueSchema,
];

export interface IFieldValue {
  type: FieldType;
  value: FieldValueType | undefined;
}

const IFieldValueObject: IFieldValue = {
  type: (FieldTypeSchema.required() as unknown) as FieldType,
  value: (FieldValueTypeSchema as unknown) as FieldValueType,
};

export const IFieldValueSchema = Joi.object(IFieldValueObject);

export interface IFieldType {
  getType(): FieldType;
  getName(): string;
  getInput(
    props: IFormElementProps,
    instanceEnv: IInstanceEnvironment,
    actionHandler: ActionHandler,
    onFieldValueChanged: () => void,
    showInvalidFields: boolean,
    startEventId?: string,
  ): JSX.Element | undefined;
  renderValue(
    value: {} | undefined,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  renderValueForEmail(
    value: {} | undefined,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  renderValueToMarkdown(value: {} | undefined, instance: IInstanceDetails, process: IProcessDetails, user: IUserDetails, config?: IFieldConfig): string | undefined;
  renderValueToString(value: {} | undefined, instance: IInstanceDetails, process: IProcessDetails, user: IUserDetails, config?: IFieldConfig): string | undefined;
  renderValueForGrid(
    field: IFieldValue,
    fieldName: string,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    columnName: string,
    grid: Component,
  ): string | Date | undefined;
  getSettingsButton(
    fieldDefinition: IFieldDefinition,
    onConfigChanged: (fieldDefinition: IFieldDefinition) => void,
    bpmnProcess: Process.BpmnProcess,
  ): JSX.Element | undefined;
  isVisible(): boolean;
  isValid(fieldDefinition: IFieldDefinition, instanceEnv: IInstanceEnvironment): Promise<boolean>;
  isConfigValid(fieldDefinition: IFieldDefinition): { valid: boolean; message?: string };
}

const IFieldTypeObject: IFieldType = {
  getType: (Joi.function().required() as unknown) as () => FieldType,
  getName: (Joi.function().required() as unknown) as () => string,
  getInput: (Joi.function().required() as unknown) as () => JSX.Element,
  renderValue: (Joi.function().required() as unknown) as () => JSX.Element,
  renderValueForEmail: (Joi.function().required() as unknown) as () => JSX.Element,
  renderValueForGrid: (Joi.function().required() as unknown) as () => string | Date | undefined,
  renderValueToMarkdown: (Joi.function().required() as unknown) as () => string,
  renderValueToString: (Joi.function().required() as unknown) as () => string,
  getSettingsButton: (Joi.function().required() as unknown) as () => JSX.Element,
  isVisible: (Joi.function().required() as unknown) as () => boolean,
  isValid: (Joi.function().required() as unknown) as () => Promise<boolean>,
  isConfigValid: (Joi.function().required() as unknown) as () => { valid: boolean; message?: string },
};

export const IFieldTypeSchema = Joi.object(IFieldTypeObject);

export interface IFormElementProps {
  value: FieldValueType | undefined;
  label: string;
  required: boolean;
  restricted: boolean;
  // Is it allowed to edit the field config directly from a running instance (for process managers)?
  inlineEditingActive: boolean | undefined;
  disabled: boolean;
  config: IFieldConfig;
  key?: string;
}

const IFormElementPropsObject: IFormElementProps = {
  value: (FieldValueTypeSchema as unknown) as FieldValueType,
  label: (Joi.string().allow("").required() as unknown) as string,
  required: (Joi.boolean().required() as unknown) as boolean,
  restricted: (Joi.boolean().required() as unknown) as boolean,
  inlineEditingActive: (Joi.boolean() as unknown) as boolean,
  disabled: (Joi.boolean().required() as unknown) as boolean,
  config: (IFieldConfigSchema as unknown) as IFieldConfig,
  key: (Joi.string().allow("") as unknown) as string,
};

export const IFormElementPropsSchema = Joi.object(IFormElementPropsObject);

/**
 * Check if an element implements the FieldValue interface
 * @param element element to check
 * @return {boolean} true, if element implements the FieldValue interface, false otherwise
 */
export function isFieldValue(element: {} | undefined): element is IFieldValue {
  return IFieldValueSchema.required().validate(element).error === undefined;
}

export interface IFieldContentMap {
  [fieldId: string]: string | string[] | boolean | IFieldValue;
}

export const IFieldContentMapSchema = Joi.object().pattern(Joi.string(), [Joi.string(), Joi.array().items(Joi.string()), Joi.boolean(), Joi.object(IFieldValueObject)]);

// Returns the name of the best fitting Semantic UI icon for the specified file name
export function getFiletypeIcon(filename: string): string {
  if (filename == null || filename.length === 0) return "file outline";

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
/* eslint-disable @typescript-eslint/naming-convention */
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
/* eslint-enable @typescript-eslint/naming-convention */

interface IStatisticTrailEntryTodo {
  todoId?: string;
  bpmnTaskId: string;
  bpmnLaneId: string;
  desicionTaskBpmnTaskId?: string;
  timeOverDueDate?: number;
}

const IStatisticTrailEntryTodoObject: IStatisticTrailEntryTodo = {
  todoId: (Joi.string().allow("") as unknown) as string,
  bpmnTaskId: (Joi.string().allow("").required() as unknown) as string,
  bpmnLaneId: (Joi.string().allow("").required() as unknown) as string,
  desicionTaskBpmnTaskId: (Joi.string().allow("") as unknown) as string,
  timeOverDueDate: (Joi.number() as unknown) as number,
};

export const IStatisticTrailEntryTodoSchema = Joi.object(IStatisticTrailEntryTodoObject);

interface IStatisticTrailEntryInstance {
  instanceId: string;
  jumpToBpmnTask?: string;
}

const IStatisticTrailEntryInstanceObject: IStatisticTrailEntryInstance = {
  instanceId: (Joi.string().allow("").required() as unknown) as string,
  jumpToBpmnTask: (Joi.string().allow("") as unknown) as string,
};

export const IStatisticTrailEntryInstanceSchema = Joi.object(IStatisticTrailEntryInstanceObject);

interface IStatisticTrailEntryUser {
  instanceId: string;
}

const IStatisticTrailEntryUserObject: IStatisticTrailEntryUser = {
  instanceId: (Joi.string().allow("").required() as unknown) as string,
};

export const IStatisticTrailEntryUserSchema = Joi.object(IStatisticTrailEntryUserObject);

export interface IStatisticTrailEntry {
  todo?: IStatisticTrailEntryTodo;
  instance?: IStatisticTrailEntryInstance;
  user?: IStatisticTrailEntryUser;
  process?: {};
}

const IStatisticTrailEntryObject: IStatisticTrailEntry = {
  todo: (IStatisticTrailEntryTodoSchema as unknown) as IStatisticTrailEntryTodo,
  instance: (IStatisticTrailEntryInstanceSchema as unknown) as IStatisticTrailEntryInstance,
  user: (IStatisticTrailEntryUserSchema as unknown) as IStatisticTrailEntryUser,
  process: Joi.object(),
};

export const IStatisticTrailEntrySchema = Joi.object(IStatisticTrailEntryObject);

export interface IStatisticRow {
  statisticsId: string;
  workspaceId: string;
  processId: string;
  details: IStatisticTrailEntry;
  action: StatisticsAction;
  userDetails?: IUserDetails;
  userId: string;
  createdAt: Date;
}

export interface IHeatmapDatapoint {
  bpmnElementId: string;
  value: number;
}

const IHeatmapDatapointObject: IHeatmapDatapoint = {
  bpmnElementId: (Joi.string().allow("").required() as unknown) as string,
  value: (Joi.number().required() as unknown) as number,
};

export const IHeatmapDatapointSchema = Joi.object(IHeatmapDatapointObject);
