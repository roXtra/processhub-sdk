import Joi from "joi";

export type IRoxFileLinkValue = {
  roxFileName: string | undefined;
  roxFileId: number;
  /**
   * @deprecated use mimeTypeIcon
   */
  roxFileIconUrl: string | undefined;
  /**
   * File name of the mime type icon without URL/hostname (eg "docx.svg")
   */
  mimeTypeIcon: string | undefined;
}[];

const IRoxFileLinkValueObject: {
  roxFileName: string | undefined;
  roxFileId: number;
  roxFileIconUrl: string | undefined;
  mimeTypeIcon: string | undefined;
} = {
  roxFileName: Joi.string().allow("") as unknown as string,
  roxFileId: Joi.number().required() as unknown as number,
  roxFileIconUrl: Joi.string().allow("") as unknown as string,
  mimeTypeIcon: Joi.string().allow("") as unknown as string,
};

export const IRoxFileLinkValueSchema = Joi.array().items(Joi.object(IRoxFileLinkValueObject));
