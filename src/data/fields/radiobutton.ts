import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface IRadioButtonFieldValue {
  name: string;
}

const IRadioButtonFieldValueObject: IRadioButtonFieldValue = {
  name: Joi.string().allow("").required() as unknown as string,
};

export const IRadioButtonFieldValueSchema = Joi.object(IRadioButtonFieldValueObject);

export interface IRadioButtonGroupFieldValue {
  // There are existing instances where the index is outside the range of the radioButtons - to enforce undefined checks the value type is (IRadioButtonFieldValue | undefined)
  radioButtons: (IRadioButtonFieldValue | undefined)[];
  selectedRadio: number | undefined;
}

const IRadioButtonGroupFieldValueObject: IRadioButtonGroupFieldValue = {
  radioButtons: Joi.array().items(Joi.object(IRadioButtonFieldValueObject)).required() as unknown as IRadioButtonFieldValue[],
  selectedRadio: Joi.number() as unknown as number,
};

export const IRadioButtonGroupFieldValueSchema = Joi.object(IRadioButtonGroupFieldValueObject);

export interface IRadioButtonGroupEntry {
  name: string;
  value: number;
  selected: boolean;
}

const IRadioButtonGroupEntryObject: IRadioButtonGroupEntry = {
  name: Joi.string().allow("").required() as unknown as string,
  value: Joi.number().required() as unknown as number,
  selected: Joi.boolean().required() as unknown as boolean,
};

export const IRadioButtonGroupEntrySchema = Joi.object(IRadioButtonGroupEntryObject);

export interface IRadioButtonFieldConfig extends IFieldConfigDefault<IRadioButtonGroupFieldValue> {
  entries: IRadioButtonGroupEntry[];
  oneEntryMustBeChecked: boolean;
}

const IRadioButtonFieldConfigObject: IRadioButtonFieldConfig = {
  entries: Joi.array().items(Joi.object(IRadioButtonGroupEntryObject)).required() as unknown as IRadioButtonGroupEntry[],
  oneEntryMustBeChecked: Joi.boolean().required() as unknown as boolean,
  defaultValue: IRadioButtonGroupFieldValueSchema as unknown as IRadioButtonGroupFieldValue,
  ...IFieldConfigObject,
};

export const IRadioButtonFieldConfigSchema = Joi.object(IRadioButtonFieldConfigObject);
