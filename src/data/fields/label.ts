import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces.js";

export interface ILabelConfig extends IFieldConfig {
  labelHtml?: string;
}

const ILabelConfigObject: ILabelConfig = {
  labelHtml: Joi.string().allow("") as unknown as string,
  ...IFieldConfigObject,
};

export const ILabelConfigSchema = Joi.object(ILabelConfigObject);
