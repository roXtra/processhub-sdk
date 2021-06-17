import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface INumberFieldConfig extends IFieldConfigDefault {
  evalDefaultValue: boolean;
  onlyIntegers: boolean;
}

const INumberFieldConfigObject: INumberFieldConfig = {
  evalDefaultValue: Joi.boolean().required() as unknown as boolean,
  onlyIntegers: Joi.boolean().required() as unknown as boolean,
  // Extends IFieldConfigDefault
  ...IFieldConfigDefaultObject,
};

export const INumberFieldConfigSchema = Joi.object(INumberFieldConfigObject);
