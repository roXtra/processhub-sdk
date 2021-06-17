import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export type IDateFieldConfig = IFieldConfigDefault;

export const IDateFieldConfigSchema = Joi.object(IFieldConfigDefaultObject);
