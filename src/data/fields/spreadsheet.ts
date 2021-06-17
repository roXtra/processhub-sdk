import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigDefaultObject } from "../datainterfaces";

export interface ISpreadSheetFieldValue {
  // "fileUrl" is defined for all SpreadSheet fields were the value is saved in the file system and not in the DB
  fileUrl: string | undefined;
  url: string;
  value: {} | undefined;
}

const ISpreadSheetFieldValueObject: ISpreadSheetFieldValue = {
  fileUrl: Joi.string().allow("").required() as unknown as string,
  url: Joi.string().allow("").required() as unknown as string,
  value: Joi.object().required() as unknown as {},
};

export const ISpreadSheetFieldValueSchema = Joi.object(ISpreadSheetFieldValueObject);

export type ISpreadSheetFieldConfig = IFieldConfigDefault;

export const ISpreadSheetFieldConfigSchema = Joi.object(IFieldConfigDefaultObject);
