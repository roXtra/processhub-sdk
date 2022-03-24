import { IPathDetails } from "./path/pathinterfaces.js";
import { IUserDetails } from "./user/userinterfaces.js";
import { IWorkspaceDetails } from "./workspace/workspaceinterfaces.js";
import { IProcessDetails } from "./process/processinterfaces.js";
import { IInstanceDetails } from "./instance/instanceinterfaces.js";
import { ITodoDetails } from "./todo/todointerfaces.js";

export interface ICoreEnvironment {
  path: IPathDetails;
  user: IUserDetails;
}

export interface IWorkspaceEnvironment extends ICoreEnvironment {
  workspace: IWorkspaceDetails | undefined;
}

export interface IProcessEnvironment extends ICoreEnvironment {
  workspace: IWorkspaceDetails;
  process: IProcessDetails;
}

export interface IInstanceEnvironment extends ICoreEnvironment {
  workspace: IWorkspaceDetails;
  process: IProcessDetails;
  instance: IInstanceDetails;
}

export interface ITodoEnvironment extends ICoreEnvironment {
  workspace: IWorkspaceDetails;
  process: IProcessDetails;
  instance: IInstanceDetails;
  todo: ITodoDetails;
}

export function isValidCoreEnvironment(coreEnv: {}, requireUser = true): coreEnv is ICoreEnvironment {
  if (coreEnv == null) return false;

  if (!requireUser) return true;
  else return (coreEnv as ICoreEnvironment).user != null;
}
export function isValidWorkspaceEnvironment(workspaceEnv: {}, requireUser = true): workspaceEnv is IWorkspaceEnvironment {
  return isValidCoreEnvironment(workspaceEnv, requireUser) && (workspaceEnv as IWorkspaceEnvironment).workspace != null;
}
export function isValidProcessEnvironment(processEnv: {}, requireUser = true): processEnv is IProcessEnvironment {
  return isValidWorkspaceEnvironment(processEnv, requireUser) && (processEnv as IProcessEnvironment).process != null;
}
export function isValidInstanceEnvironment(instanceEnv: {}, requireUser = true): instanceEnv is IInstanceEnvironment {
  return isValidProcessEnvironment(instanceEnv, requireUser) && (instanceEnv as IInstanceEnvironment).instance != null;
}
export function isValidTodoEnvironment(todoEnv: {}, requireUser = true): todoEnv is ITodoEnvironment {
  return isValidProcessEnvironment(todoEnv, requireUser) && (todoEnv as ITodoEnvironment).todo != null;
}
