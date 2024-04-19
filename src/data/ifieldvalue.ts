import Joi from "joi";
import { IRiskAssessmentTargetValue, IRiskAssessmentTargetValueSchema, IRiskAssessmentValue, IRiskAssessmentValueSchema } from "../instance/instanceinterfaces.js";
import { RiskAssessmentCycle, RiskAssessmentCycleSchema } from "../riskassessment/riskassessmentinterfaces.js";
import { IAuditQuestionsFieldValue } from "./fields/auditquestions.js";
import { IDateRangeFieldValue, IDateRangeFieldValueSchema } from "./fields/daterange.js";
import { IProcessLinkValue, IProcessLinkValueSchema } from "./fields/processlink.js";
import { IRadioButtonGroupFieldValue, IRadioButtonGroupFieldValueSchema } from "./fields/radiobutton.js";
import { IRoxFileFieldValue, IRoxFileFieldValueSchema } from "./fields/roxfilefield.js";
import { IRoxFileLinkValue, IRoxFileLinkValueSchema } from "./fields/roxfilelink.js";
import { ISignatureFieldValue, ISignatureFieldValueSchema } from "./fields/signature.js";
import { ISpreadSheetFieldValue, ISpreadSheetFieldValueSchema } from "./fields/spreadsheet.js";
import { ISVGDropdownOption, ISVGDropdownOptionSchema } from "./fields/svgdropdown.js";
import { ITasksFieldValue, ITasksFieldValueSchema } from "./fields/tasks.js";
import { ITreeViewFieldValue, TreeViewFieldValueSchema } from "./fields/treeview.js";
import { createLiteralTypeRegExp } from "./regextools.js";
import { IDataTableFieldValue } from "./fields/datatable.js";

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
  "ProcessHubDateRange",
  "ProcessHubAuditQuestions",
  "ProcessHubDataTable",
] as const;

export type FieldType = (typeof FieldTypeOptions)[number];

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
  | ITreeViewFieldValue // TreeViewField
  | IDateRangeFieldValue // DateRange
  | IAuditQuestionsFieldValue // Audit
  | IDataTableFieldValue; // DataTable

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
  IDateRangeFieldValueSchema,
];

export const FieldTypeSchema = Joi.string().pattern(createLiteralTypeRegExp(Object.values(FieldTypeOptions)));

export interface IFieldValue {
  type: FieldType;
  value: FieldValueType | undefined | null;
}

const IFieldValueObject: IFieldValue = {
  type: FieldTypeSchema.required() as unknown as FieldType,
  value: FieldValueTypeSchema as unknown as FieldValueType,
};

export const IFieldValueSchema = Joi.object(IFieldValueObject);
