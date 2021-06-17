import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface ITextAreaFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
  enableExperimental: boolean;
}

const ITextAreaFieldConfigObject: ITextAreaFieldConfig = {
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  enableExperimental: Joi.boolean().required() as unknown as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const ITextAreaFieldConfigSchema = Joi.object(ITextAreaFieldConfigObject);
