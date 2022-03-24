import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface IChecklistEntry {
  name: string;
}

const IChecklistEntryObject: IChecklistEntry = {
  name: Joi.string().allow("").required() as unknown as string,
};

export const IChecklistEntrySchema = Joi.object(IChecklistEntryObject);

export type ChecklistFieldValue = { [key: string]: boolean };

export const ChecklistFieldValueSchema = Joi.object().pattern(Joi.string().allow(""), Joi.boolean());

export interface IChecklistFieldConfig extends IFieldConfigDefault<ChecklistFieldValue> {
  entries: IChecklistEntry[];
  oneEntryMustBeChecked: boolean;
}

const IChecklistFieldConfigObject: IChecklistFieldConfig = {
  entries: Joi.array().items(Joi.object(IChecklistEntryObject)).required() as unknown as IChecklistEntry[],
  oneEntryMustBeChecked: Joi.boolean().required() as unknown as boolean,
  defaultValue: ChecklistFieldValueSchema as unknown as ChecklistFieldValue,
  ...IFieldConfigObject,
};

export const IChecklistFieldConfigSchema = Joi.object(IChecklistFieldConfigObject);
