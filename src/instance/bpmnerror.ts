export enum ErrorCode {
  UnknownError = "UNKNOWN_ERROR",
  ScriptIsUndefined = "SCRIPT_IS_UNDEFINED",
  ConfigInvalid = "CONFIG_INVALID",
}

export class BpmnError {
  public readonly errorCode: ErrorCode | string;
  public readonly errorMessage: string;
  public readonly innerError: Error | undefined;

  public constructor(errorCode: string, errorMessage: string, innerError?: Error) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.innerError = innerError;
  }
}
