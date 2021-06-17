import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

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

export interface ISVGDropdownFieldConfig extends IFieldConfigDefault {
  options: ISVGDropdownOption[];
}

const ISVGDropdownFieldConfigObject: ISVGDropdownFieldConfig = {
  options: Joi.array().items(ISVGDropdownOptionSchema).required() as unknown as ISVGDropdownOption[],
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const ISVGDropdownFieldConfigSchema = Joi.object(ISVGDropdownFieldConfigObject);
