import { IPathDetails } from "./path/pathinterfaces.js";
import { StateWorkspaceDetails } from "./workspace/workspaceinterfaces.js";
import { IInstanceDetails } from "./instance/instanceinterfaces.js";
import { ITodoDetails } from "./todo/todointerfaces.js";
import { StateProcessDetails } from "./process/processstate.js";
import { StateUserDetails } from "./user/phclient.js";

export interface ICoreEnvironment {
  path: IPathDetails;
  user: StateUserDetails;
}

export interface IWorkspaceEnvironment extends ICoreEnvironment {
  workspace: StateWorkspaceDetails | undefined;
}

export interface IProcessEnvironment extends ICoreEnvironment {
  workspace: StateWorkspaceDetails;
  process: StateProcessDetails;
}

export interface IInstanceEnvironment extends ICoreEnvironment {
  workspace: StateWorkspaceDetails;
  process: StateProcessDetails;
  instance: IInstanceDetails;
}

export interface ITodoEnvironment extends ICoreEnvironment {
  workspace: StateWorkspaceDetails;
  process: StateProcessDetails;
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
