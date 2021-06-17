import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export type IMailFieldConfig = IFieldConfigDefault;

export const IMailFieldConfigSchema = Joi.object(IFieldConfigDefaultObject);
