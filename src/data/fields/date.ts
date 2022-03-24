import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export type IDateFieldConfig = IFieldConfigDefault<Date>;

const IDateFieldConfigObject: IDateFieldConfig = {
  defaultValue: Joi.date() as unknown as Date,
  ...IFieldConfigObject,
};

export const IDateFieldConfigSchema = Joi.object(IDateFieldConfigObject);
