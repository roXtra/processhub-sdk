import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

interface ISVGData {
  normal?: string;
  detailed?: string;
}

export interface ISVGDropdownOption {
  text: string;
  svgData: ISVGData;
}

const svgDataObject: ISVGData = {
  normal: Joi.string() as unknown as string,
  detailed: Joi.string() as unknown as string,
};

const ISVGDropdownOptionObject: ISVGDropdownOption = {
  text: Joi.string().allow("").required() as unknown as string,
  svgData: Joi.object(svgDataObject).required() as unknown as ISVGData,
};

export const ISVGDropdownOptionSchema = Joi.object(ISVGDropdownOptionObject);

export interface ISVGDropdownFieldConfig extends IFieldConfigDefault<ISVGDropdownOption> {
  options: ISVGDropdownOption[];
}

const ISVGDropdownFieldConfigObject: ISVGDropdownFieldConfig = {
  options: Joi.array().items(ISVGDropdownOptionSchema).required() as unknown as ISVGDropdownOption[],
  defaultValue: ISVGDropdownOptionSchema as unknown as ISVGDropdownOption,
  ...IFieldConfigObject,
};

export const ISVGDropdownFieldConfigSchema = Joi.object(ISVGDropdownFieldConfigObject);
