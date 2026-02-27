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

export function isValidCoreEnvironment(coreEnv: unknown, requireUser = true): coreEnv is ICoreEnvironment {
  if (coreEnv == null) return false;

  if (!requireUser) return true;
  return (coreEnv as Partial<ICoreEnvironment>).user != null;
}
export function isValidWorkspaceEnvironment(workspaceEnv: unknown, requireUser = true): workspaceEnv is IWorkspaceEnvironment {
  return isValidCoreEnvironment(workspaceEnv, requireUser) && (workspaceEnv as Partial<IWorkspaceEnvironment>).workspace != null;
}
export function isValidProcessEnvironment(processEnv: unknown, requireUser = true): processEnv is IProcessEnvironment {
  return isValidWorkspaceEnvironment(processEnv, requireUser) && (processEnv as Partial<IProcessEnvironment>).process != null;
}
export function isValidInstanceEnvironment(instanceEnv: unknown, requireUser = true): instanceEnv is IInstanceEnvironment {
  return isValidProcessEnvironment(instanceEnv, requireUser) && (instanceEnv as Partial<IInstanceEnvironment>).instance != null;
}
export function isValidTodoEnvironment(todoEnv: unknown, requireUser = true): todoEnv is ITodoEnvironment {
  return isValidProcessEnvironment(todoEnv, requireUser) && (todoEnv as Partial<ITodoEnvironment>).todo != null;
}
