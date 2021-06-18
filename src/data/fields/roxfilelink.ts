import Joi from "joi";

export type IRoxFileLinkValue = {
  roxFileName: string | undefined;
  roxFileId: number;
  roxFileIconUrl: string | undefined;
}[];

const IRoxFileLinkValueObject: {
  roxFileName: string | undefined;
  roxFileId: number;
  roxFileIconUrl: string | undefined;
} = {
  roxFileName: Joi.string().allow("") as unknown as string,
  roxFileId: Joi.number().required() as unknown as number,
  roxFileIconUrl: Joi.string().allow("") as unknown as string,
};

export const IRoxFileLinkValueSchema = Joi.array().items(Joi.object(IRoxFileLinkValueObject));
