import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces";

export interface IFileUploadFieldConfig extends IFieldConfig {
  validationExpression?: string;
}

const IFileUploadFieldConfigObject: IFileUploadFieldConfig = {
  validationExpression: Joi.string().allow("") as unknown as string,
  ...IFieldConfigObject,
};

export const IFileUploadFieldConfigSchema = Joi.object(IFileUploadFieldConfigObject);
