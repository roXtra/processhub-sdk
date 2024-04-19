import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

// Default value if from type string, as it may be a JavaScript expression
export interface INumberFieldConfig extends IFieldConfigDefault<string> {
  evalDefaultValue: boolean;
  onlyIntegers: boolean;
}

const INumberFieldConfigObject: INumberFieldConfig = {
  defaultValue: Joi.number() as unknown as string,
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  onlyIntegers: Joi.boolean().required() as unknown as boolean,
  ...IFieldConfigObject,
};

export const INumberFieldConfigSchema = Joi.object(INumberFieldConfigObject);
