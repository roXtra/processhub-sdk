import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface ITextAreaFieldConfig extends IFieldConfigDefault<string> {
  evalDefaultValue: boolean;
}

const ITextAreaFieldConfigObject: ITextAreaFieldConfig = {
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  defaultValue: Joi.string().allow("") as unknown as string,
  ...IFieldConfigObject,
};

export const ITextAreaFieldConfigSchema = Joi.object(ITextAreaFieldConfigObject);
