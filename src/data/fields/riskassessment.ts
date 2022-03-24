import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces.js";

export interface IRiskAssessmentFieldConfig extends IFieldConfig {
  usePreviousValueAsDefault: boolean | undefined;
}

const IRiskAssessmentFieldConfigObject: IRiskAssessmentFieldConfig = {
  usePreviousValueAsDefault: Joi.boolean().required() as unknown as boolean,
  ...IFieldConfigObject,
};

export const IRiskAssessmentFieldConfigSchema = Joi.object(IRiskAssessmentFieldConfigObject);
