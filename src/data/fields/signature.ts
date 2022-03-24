import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces.js";

export interface ISignatureFieldValue {
  svgDataUrl: string | undefined;
  dataPoints: {} | undefined;
}

const ISignatureFieldValueObject: ISignatureFieldValue = {
  svgDataUrl: Joi.string().allow("") as unknown as string,
  dataPoints: Joi.object() as unknown as {},
};

export const ISignatureFieldValueSchema = Joi.object(ISignatureFieldValueObject);

export type ISignatureFieldConfig = IFieldConfig;

export const ISignatureFieldConfigSchema = Joi.object(IFieldConfigObject);
