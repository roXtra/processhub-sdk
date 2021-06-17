import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface IInstanceTitleFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
}

const IInstanceTitleFieldConfigObject: IInstanceTitleFieldConfig = {
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IInstanceTitleFieldConfigSchema = Joi.object(IInstanceTitleFieldConfigObject);
