import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface IInstanceTitleFieldConfig extends IFieldConfigDefault<string> {
  evalDefaultValue: boolean;
}

const IInstanceTitleFieldConfigObject: IInstanceTitleFieldConfig = {
  defaultValue: Joi.string().allow("") as unknown as string,
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  ...IFieldConfigObject,
};

export const IInstanceTitleFieldConfigSchema = Joi.object(IInstanceTitleFieldConfigObject);
