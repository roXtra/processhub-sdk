import { IBaseError } from "./apiinterfaces.js";

let errorHandlers: IErrorHandler[] = [];

export function registerErrorHandler(handler: IErrorHandler): void {
  errorHandlers.push(handler);
}

export function removeErrorHandler(handler: IErrorHandler): void {
  errorHandlers = errorHandlers.filter((e) => e !== handler);
}

export function getErrorHandlers(): IErrorHandler[] {
  return errorHandlers;
}

export interface IErrorHandler {
  handleError(error: IBaseError, requestPath: string, showErrorModal?: boolean): void;
}
