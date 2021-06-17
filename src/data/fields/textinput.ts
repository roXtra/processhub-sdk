import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface ITextInputFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
}

const ITextInputFieldConfigObject: ITextInputFieldConfig = {
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const ITextInputFieldConfigSchema = Joi.object(ITextInputFieldConfigObject);
