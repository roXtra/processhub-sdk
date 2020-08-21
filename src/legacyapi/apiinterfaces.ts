import { ModuleId } from "../modules";

// Die ApiResults werden auch als Http Statuscodes genutzt
export enum ApiResult {
  API_OK = 200,
  API_CREATED = 201,
  API_NOCONTENT = 204,
  API_INVALID = 400,
  API_DENIED = 401,
  API_FORBIDDEN = 403,  // Is used instead of 401 if no user is authenticated but a function is called that requires authentication
  // -> will redirect client to signin page
  API_NOTFOUND = 404,
  API_REQUESTTIMEOUT = 408,
  API_DUPLICATE = 409,
  API_NOTEMPTY = 423,
  API_ERROR = 500,
  API_BADGATEWAY = 502,
  API_ERROR_ROXAPI = 512
}
// Export const API_OK = 200;
// export const API_INVALID = 400;  // ungültige Anfrage
// export const API_ERROR = 500;  // Serverfehler
// export const API_DENIED = 401;
// export const API_DUPLICATE = 409; // Datensatz gibt es bereits
// export const API_NOTFOUND = 404;
// export const API_NOTEMPTY = 423; // Workspace/Bucket kann nicht entfernt werden, da er noch Elemente enthält
// export type ApiResult = 200 | 400 | 401 | 409 | 404 | 423 | 500;

export type ApiError = 400 | 401 | 409 | 404 | 423 | 500;

export interface IBaseReply {
  type?: string;
  result: ApiResult;
}

export interface IBaseRequest {
  moduleId?: ModuleId;
}

export interface IBaseMessage extends IBaseReply {
  type: string;
}

export const API_FAILED = "FAILED";
export const API_SUCCESS = "OK";
export interface IBaseError extends IBaseMessage {
  request?: IBaseRequest;  // Enthält den urprünglichen Aufruf
}