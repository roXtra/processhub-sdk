import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces.js";
import { createLiteralTypeRegExp } from "../regextools.js";

const IRoleOwnerFieldConfigDefaultValueOptions = ["NoValue", "CurrentUser"] as const;

type IRoleOwnerFieldConfigDefaultValueType = (typeof IRoleOwnerFieldConfigDefaultValueOptions)[number];

export interface IRoleOwnerFieldConfig extends IFieldConfig {
  defaultValue: IRoleOwnerFieldConfigDefaultValueType | undefined;
}

const IRoleOwnerFieldConfigObject: IRoleOwnerFieldConfig = {
  defaultValue: Joi.string().pattern(createLiteralTypeRegExp(Object.values(IRoleOwnerFieldConfigDefaultValueOptions))) as unknown as IRoleOwnerFieldConfigDefaultValueType,
  ...IFieldConfigObject,
};

export const IRoleOwnerFieldConfigSchema = Joi.object(IRoleOwnerFieldConfigObject);
