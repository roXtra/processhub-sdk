import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces";

export interface IDropdownFieldConfig extends IFieldConfigDefault<string> {
  entries: string[];
}

const IDropdownFieldConfigObject: IDropdownFieldConfig = {
  defaultValue: Joi.string().allow("") as unknown as string,
  entries: Joi.array().items(Joi.string().allow("")).required() as unknown as string[],
  ...IFieldConfigObject,
};

export const IDropdownFieldConfigSchema = Joi.object(IDropdownFieldConfigObject);
