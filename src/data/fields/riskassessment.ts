import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces";

export interface IRiskAssessmentFieldConfig extends IFieldConfig {
  validationExpression: string | undefined;
  usePreviousValueAsDefault: boolean | undefined;
}

const IRiskAssessmentFieldConfigObject: IRiskAssessmentFieldConfig = {
  validationExpression: Joi.string().allow("") as unknown as string,
  usePreviousValueAsDefault: Joi.boolean().required() as unknown as boolean,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IRiskAssessmentFieldConfigSchema = Joi.object(IRiskAssessmentFieldConfigObject);
