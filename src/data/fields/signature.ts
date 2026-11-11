import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces.js";

export interface ISignatureFieldValue {
  svgDataUrl: string | undefined;
  // oxlint-disable-next-line typescript/no-empty-object-type
  dataPoints: {} | undefined;
}

const ISignatureFieldValueObject: ISignatureFieldValue = {
  svgDataUrl: Joi.string().allow("") as unknown as string,
  dataPoints: Joi.object(),
};

export const ISignatureFieldValueSchema = Joi.object(ISignatureFieldValueObject);

export type ISignatureFieldConfig = IFieldConfig;

export const ISignatureFieldConfigSchema = Joi.object(IFieldConfigObject);
