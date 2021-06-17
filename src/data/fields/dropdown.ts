import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface IDropdownFieldConfig extends IFieldConfigDefault {
  options: string[];
}

const IDropdownFieldConfigObject: IDropdownFieldConfig = {
  options: Joi.array().items(Joi.string().allow("")).required() as unknown as string[],
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const IDropdownFieldConfigSchema = Joi.object(IDropdownFieldConfigObject);
