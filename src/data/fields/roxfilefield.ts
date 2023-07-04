import Joi from "joi";
import { IFieldConfig, IFieldConfigObject } from "../datainterfaces";

export interface IRoxFileFieldValue {
  url?: string;
  lockedAt?: Date;
  lockedByUserName?: string;
  lockedByUserId?: string;
}

const IRoxFileFieldValueObject: IRoxFileFieldValue = {
  url: Joi.string().allow("") as unknown as string,
  lockedAt: Joi.date() as unknown as Date,
  lockedByUserName: Joi.string().allow("") as unknown as string,
  lockedByUserId: Joi.string().allow("") as unknown as string,
};

export const IRoxFileFieldValueSchema = Joi.object(IRoxFileFieldValueObject);

export interface IRoxFileFieldConfig extends IFieldConfig {
  roxFileName: string | undefined;
  roxFileId: number | undefined;
  /**
   * @deprecated use mimeTypeIcon
   */
  roxFileIconUrl: string | undefined;
  /**
   * File name of the mime type icon without URL/hostname (eg "docx.svg")
   */
  mimeTypeIcon: string | undefined;
  /**
   * Flag if field is configured for the workflow-file
   */
  roxWorkflowField: boolean | undefined;
}

const IRoxFileFieldConfigObject: IRoxFileFieldConfig = {
  roxFileName: Joi.string().allow("") as unknown as string,
  roxFileId: Joi.number() as unknown as number,
  roxFileIconUrl: Joi.string().allow("") as unknown as string,
  mimeTypeIcon: Joi.string().allow("") as unknown as string,
  roxWorkflowField: Joi.boolean().allow("") as unknown as boolean,
  ...IFieldConfigObject,
};

export const IRoxFileFieldConfigSchema = Joi.object(IRoxFileFieldConfigObject);
