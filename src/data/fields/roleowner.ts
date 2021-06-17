import Joi from "joi";
import { createLiteralTypeRegExp, IFieldConfig, IFieldConfigObject } from "../datainterfaces";

const IRoleOwnerFieldConfigDefaultValueOptions = ["NoValue", "CurrentUser"] as const;

type IRoleOwnerFieldConfigDefaultValueType = typeof IRoleOwnerFieldConfigDefaultValueOptions[number];

export interface IRoleOwnerFieldConfig extends IFieldConfig {
  validationExpression?: string;
  defaultValue: IRoleOwnerFieldConfigDefaultValueType | undefined;
}

const IRoleOwnerFieldConfigObject: IRoleOwnerFieldConfig = {
  validationExpression: Joi.string().allow("") as unknown as string,
  defaultValue: Joi.string().pattern(createLiteralTypeRegExp(Object.values(IRoleOwnerFieldConfigDefaultValueOptions))) as unknown as IRoleOwnerFieldConfigDefaultValueType,
  // Extends IFieldConfig
  ...IFieldConfigObject,
};

export const IRoleOwnerFieldConfigSchema = Joi.object(IRoleOwnerFieldConfigObject);
