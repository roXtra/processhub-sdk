import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces";

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

export type ISpreadSheetFieldConfig = IFieldConfigDefault<ISpreadSheetFieldValue>;

const ISpreadSheetFieldConfigObject: ISpreadSheetFieldConfig = {
  defaultValue: ISpreadSheetFieldValueSchema as unknown as ISpreadSheetFieldValue,
  ...IFieldConfigObject,
};

export const ISpreadSheetFieldConfigSchema = Joi.object(ISpreadSheetFieldConfigObject);
