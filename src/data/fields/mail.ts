import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

export type IMailFieldConfig = IFieldConfigDefault<string>;

const IMailFieldConfigObject: IMailFieldConfig = {
  defaultValue: Joi.string().allow("") as unknown as string,
  ...IFieldConfigObject,
};

export const IMailFieldConfigSchema = Joi.object(IMailFieldConfigObject);
