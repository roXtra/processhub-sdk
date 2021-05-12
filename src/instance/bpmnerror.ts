import Joi from "joi";

export enum ErrorCode {
  UnknownError = "UNKNOWN_ERROR",
  ScriptIsUndefined = "SCRIPT_IS_UNDEFINED",
  ConfigInvalid = "CONFIG_INVALID",
}

export class BpmnError extends Error {
  public readonly errorCode: ErrorCode | string;
  public readonly errorMessage: string;
  public readonly innerError: Error | undefined;

  public constructor(errorCode: string, errorMessage: string, innerError?: Error) {
    super(errorMessage);
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.innerError = innerError;
  }
}

const BpmnErrorObject: BpmnError = {
  errorCode: Joi.string().allow("") as unknown as string,
  errorMessage: Joi.string().allow("") as unknown as string,
  message: Joi.string().allow("") as unknown as string,
  name: Joi.string().allow("") as unknown as string,
  innerError: Joi.object().optional() as unknown as Error,
  stack: Joi.string().allow("") as unknown as string,
};

export const BpmnErrorSchema = Joi.object(BpmnErrorObject);

export function isBpmnError(error: {}): error is BpmnError {
  return error && error.constructor.name === BpmnError.name && BpmnErrorSchema.required().validate(error).error === undefined;
}
