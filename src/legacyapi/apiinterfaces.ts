import Joi from "joi";

// Die ApiResults werden auch als Http Statuscodes genutzt
export enum ApiResult {
  API_OK = 200,
  API_CREATED = 201,
  API_NOCONTENT = 204,
  API_INVALID = 400,
  API_UNAUTHORIZED = 401, // User must be signed in
  API_FORBIDDEN = 403, // User is signed in but has insufficient rights
  API_NOTFOUND = 404,
  API_REQUESTTIMEOUT = 408,
  API_DUPLICATE = 409,
  API_REQUEST_ENTITY_TOO_LARGE = 413,
  API_QUOTA_EXCEEDED = 429,
  API_NOTEMPTY = 423,
  API_TODOSIGNREQUIRED = 452,
  API_TODOSIGNGXPREQUIRED = 453,
  API_ERROR = 500,
  API_BADGATEWAY = 502,
  API_ERROR_ROXAPI = 512,
}

export type ApiError = 400 | 401 | 409 | 404 | 423 | 500;

export interface IBaseReply {
  type?: string;
  result?: ApiResult;
}

export const IBaseReplyObject: IBaseReply = {
  type: Joi.string().allow("") as unknown as string,
  result: Joi.number() as unknown as number,
};

export const IBaseReplySchema = Joi.object(IBaseReplyObject);

export interface IBaseRequest {
  moduleId?: number;
}

export const IBaseRequestObject: IBaseRequest = {
  moduleId: Joi.number() as unknown as number,
};

export const IBaseRequestSchema = Joi.object(IBaseRequestObject);

export interface IBaseMessage extends IBaseReply {
  type: string;
}

export const API_FAILED = "FAILED";
export const API_SUCCESS = "OK";
export interface IBaseError extends IBaseMessage {
  request?: IBaseRequest; // Enthält den urprünglichen Aufruf
}
