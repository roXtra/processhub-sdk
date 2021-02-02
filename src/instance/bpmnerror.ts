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

export function isBpmnError(error: {}): error is BpmnError {
  return error && error.constructor.name === "BpmnError" && typeof (error as BpmnError).errorMessage === "string" && typeof (error as BpmnError).errorCode === "string";
}
