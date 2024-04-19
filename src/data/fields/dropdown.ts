import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export interface IDropdownFieldConfig extends IFieldConfigDefault<string> {
  options: string[];
}

const IDropdownFieldConfigObject: IDropdownFieldConfig = {
  defaultValue: Joi.string().allow("") as unknown as string,
  options: Joi.array().items(Joi.string().allow("")).required() as unknown as string[],
  ...IFieldConfigObject,
};

export const IDropdownFieldConfigSchema = Joi.object(IDropdownFieldConfigObject);
