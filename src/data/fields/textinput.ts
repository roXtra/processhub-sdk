import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface ITextInputFieldConfig extends IFieldConfigDefault<string> {
  evalDefaultValue: boolean;
}

const ITextInputFieldConfigObject: ITextInputFieldConfig = {
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  defaultValue: Joi.string().allow("") as unknown as string,
  ...IFieldConfigObject,
};

export const ITextInputFieldConfigSchema = Joi.object(ITextInputFieldConfigObject);
