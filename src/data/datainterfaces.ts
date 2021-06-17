import { IInstanceEnvironment } from "../environment";
import {
  IInstanceDetails,
  IRiskAssessmentTargetValue,
  IRiskAssessmentTargetValueSchema,
  IRiskAssessmentValue,
  IRiskAssessmentValueSchema,
} from "../instance/instanceinterfaces";
import { IUserDetails } from "../user";
import { Process, ActionHandler } from "..";
import { RiskAssessmentCycle, RiskAssessmentCycleSchema } from "../riskassessment/riskassessmentinterfaces";
import { IProcessDetails } from "../process";
import Joi from "joi";
import { Component } from "react";
import { ChecklistFieldValue, ChecklistFieldValueSchema } from "./fields/checklist";
import { IProcessLinkValue, IProcessLinkValueSchema } from "./fields/processlink";
import { IRadioButtonGroupFieldValue, IRadioButtonGroupFieldValueSchema } from "./fields/radiobutton";
import { IRoxFileFieldValue, IRoxFileFieldValueSchema } from "./fields/roxfilefield";
import { IRoxFileLinkValue, IRoxFileLinkValueSchema } from "./fields/roxfilelink";
import { ISignatureFieldValue, ISignatureFieldValueSchema } from "./fields/signature";
import { ISpreadSheetFieldValue, ISpreadSheetFieldValueSchema } from "./fields/spreadsheet";
import { ISVGDropdownOption, ISVGDropdownOptionSchema } from "./fields/svgdropdown";
import { ITasksFieldValue, ITasksFieldValueSchema } from "./fields/tasks";
import { TreeViewFieldValueSchema, ITreeViewFieldValue } from "./fields/treeview";

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
  "ProcessHubTreeView",
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
  "ProcessHubSVGDropdown",
  "ProcessHubTasks",
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

export const IFieldConfigObject: IFieldConfig = {
  conditionExpression: Joi.string().allow("") as unknown as string,
  conditionBuilderMode: Joi.boolean() as unknown as boolean,
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
  name: Joi.string().allow("").required() as unknown as string,
  type: FieldTypeSchema as unknown as FieldType,
  isRequired: Joi.boolean().required() as unknown as boolean,
  isRestricted: Joi.boolean() as unknown as boolean,
  inlineEditingActive: Joi.boolean() as unknown as boolean,
  config: IFieldConfigSchema as unknown as IFieldConfig,
};

export const IFieldDefinitionSchema = Joi.object(IFieldDefinitionObject);

export interface IFieldDefinitionItem {
  bpmnTaskId: string;
  isStartEvent: boolean;
  fieldDefinition: IFieldDefinition;
}

const IFieldDefinitionItemObject: IFieldDefinitionItem = {
  bpmnTaskId: Joi.string().allow("").required() as unknown as string,
  isStartEvent: Joi.boolean().required() as unknown as boolean,
  fieldDefinition: IFieldDefinitionSchema as unknown as IFieldDefinition,
};

export const IFieldDefinitionItemSchema = Joi.object(IFieldDefinitionItemObject);

export interface ITaskIdRequiredFieldsNeeded {
  taskId: string;
  requiredFieldsNeeded: boolean;
}

const ITaskIdRequiredFieldsNeededObject: ITaskIdRequiredFieldsNeeded = {
  taskId: Joi.string().allow("").required() as unknown as string,
  requiredFieldsNeeded: Joi.boolean().required() as unknown as boolean,
};

export const ITaskIdRequiredFieldsNeededSchema = Joi.object(ITaskIdRequiredFieldsNeededObject);

export interface IServiceActionConfigField {
  key: string;
  type: string;
  value: string;
}

const IServiceActionConfigFieldObject: IServiceActionConfigField = {
  key: Joi.string().allow("").required() as unknown as string,
  type: Joi.string().allow("").required() as unknown as string,
  value: Joi.string().allow("").required() as unknown as string,
};

export const IServiceActionConfigFieldSchema = Joi.object(IServiceActionConfigFieldObject);

export interface IFieldConfigDefault extends IFieldConfig {
  validationExpression?: string;
  defaultValue?:
    | string
    | Date
    | ChecklistFieldValue
    | IRadioButtonGroupFieldValue
    | ISpreadSheetFieldValue
    | IRoxFileLinkValue
    | ITasksFieldValue
    | ISVGDropdownOption
    | ITreeViewFieldValue;
}

export const IFieldConfigDefaultObject: IFieldConfigDefault = {
  validationExpression: Joi.string().allow("") as unknown as string,
  defaultValue: [
    Joi.string().allow(""),
    Joi.date(),
    ChecklistFieldValueSchema,
    IRadioButtonGroupFieldValueSchema,
    ISpreadSheetFieldValueSchema,
    IRoxFileLinkValueSchema,
    ISVGDropdownOptionSchema,
    ITasksFieldValueSchema,
    TreeViewFieldValueSchema,
  ] as unknown as string,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IFieldConfigDefaultSchema = Joi.object(IFieldConfigDefaultObject);

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
  | IRiskAssessmentTargetValue // RiskAssessmentTarget
  | ISVGDropdownOption // SVGDropdown
  | ITasksFieldValue // TasksField
  | ITreeViewFieldValue; // TreeViewField

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
  ISVGDropdownOptionSchema,
  ITasksFieldValueSchema,
  TreeViewFieldValueSchema,
];

export interface IFieldValue {
  type: FieldType;
  value: FieldValueType | undefined | null;
}

const IFieldValueObject: IFieldValue = {
  type: FieldTypeSchema.required() as unknown as FieldType,
  value: FieldValueTypeSchema as unknown as FieldValueType,
};

export const IFieldValueSchema = Joi.object(IFieldValueObject);

export interface IChartData {
  label: string;
  number: number;
  color: string;
}

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
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  renderValueForEmail(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  /**
   * Render field value for reports
   */
  renderValueForReport(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  renderValueToMarkdown(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails, user: IUserDetails, config?: IFieldConfig): string | undefined;
  renderValueToString(value: {} | undefined, instance: IInstanceDetails, process: IProcessDetails, user: IUserDetails, config?: IFieldConfig): string | undefined;
  renderValueForGrid(
    field: IFieldValue,
    fieldName: string,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config: IFieldConfig | undefined,
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
  appendValueToChartData(currentChartData: IChartData[], field: IFieldValue): void;
  getValueForInstanceTitle(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails, config?: IFieldConfig): string;
}

const IFieldTypeObject: IFieldType = {
  getType: Joi.function().required() as unknown as () => FieldType,
  getName: Joi.function().required() as unknown as () => string,
  getInput: Joi.function().required() as unknown as () => JSX.Element,
  renderValue: Joi.function().required() as unknown as () => JSX.Element,
  renderValueForEmail: Joi.function().required() as unknown as () => JSX.Element,
  renderValueForReport: Joi.function().required() as unknown as () => JSX.Element,
  renderValueForGrid: Joi.function().required() as unknown as () => string | Date | undefined,
  renderValueToMarkdown: Joi.function().required() as unknown as () => string,
  renderValueToString: Joi.function().required() as unknown as () => string,
  getSettingsButton: Joi.function().required() as unknown as () => JSX.Element,
  isVisible: Joi.function().required() as unknown as () => boolean,
  isValid: Joi.function().required() as unknown as () => Promise<boolean>,
  isConfigValid: Joi.function().required() as unknown as () => { valid: boolean; message?: string },
  appendValueToChartData: Joi.function().required() as unknown as (currentChartData: IChartData[], field: IFieldValue) => void,
  getValueForInstanceTitle: Joi.function().required() as unknown as () => string,
};

export const IFieldTypeSchema = Joi.object(IFieldTypeObject);

export interface IFormElementProps {
  value: FieldValueType | undefined | null;
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
  value: FieldValueTypeSchema as unknown as FieldValueType,
  label: Joi.string().allow("").required() as unknown as string,
  required: Joi.boolean().required() as unknown as boolean,
  restricted: Joi.boolean().required() as unknown as boolean,
  inlineEditingActive: Joi.boolean() as unknown as boolean,
  disabled: Joi.boolean().required() as unknown as boolean,
  config: IFieldConfigSchema as unknown as IFieldConfig,
  key: Joi.string().allow("") as unknown as string,
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

export interface IHeatmapDatapoint {
  bpmnElementId: string;
  value: number;
}

const IHeatmapDatapointObject: IHeatmapDatapoint = {
  bpmnElementId: Joi.string().allow("").required() as unknown as string,
  value: Joi.number().required() as unknown as number,
};

export const IHeatmapDatapointSchema = Joi.object(IHeatmapDatapointObject);
