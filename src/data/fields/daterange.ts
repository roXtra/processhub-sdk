import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface IDateRangeFieldValue {
  start: Date;
  end: Date;
}

const IDateRangeFieldValueObject: IDateRangeFieldValue = {
  start: Joi.date().required() as unknown as Date,
  end: Joi.date().required() as unknown as Date,
};

export const IDateRangeFieldValueSchema = Joi.object(IDateRangeFieldValueObject);

export type IDateRangeFieldConfig = IFieldConfigDefault<IDateRangeFieldValue>;

const IDateRangeFieldConfigObject: IDateRangeFieldConfig = {
  defaultValue: IDateRangeFieldValueSchema as unknown as IDateRangeFieldValue,
  ...IFieldConfigObject,
};

export const IDateRangeFieldConfigSchema = Joi.object(IDateRangeFieldConfigObject);
