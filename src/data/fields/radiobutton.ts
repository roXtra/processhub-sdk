import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface IRadioButtonFieldValue {
  name: string;
}

const IRadioButtonFieldValueObject: IRadioButtonFieldValue = {
  name: Joi.string().allow("").required() as unknown as string,
};

export const IRadioButtonFieldValueSchema = Joi.object(IRadioButtonFieldValueObject);

export interface IRadioButtonGroupFieldValue {
  radioButtons: IRadioButtonFieldValue[];
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

export interface IRadioButtonFieldConfig extends IFieldConfigDefault {
  entries: IRadioButtonGroupEntry[];
  oneEntryMustBeChecked: boolean;
}

const IRadioButtonFieldConfigObject: IRadioButtonFieldConfig = {
  entries: Joi.array().items(Joi.object(IRadioButtonGroupEntryObject)).required() as unknown as IRadioButtonGroupEntry[],
  oneEntryMustBeChecked: Joi.boolean().required() as unknown as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IRadioButtonFieldConfigSchema = Joi.object(IRadioButtonFieldConfigObject);
