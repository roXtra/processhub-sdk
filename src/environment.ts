import { PathDetails } from "./path/pathinterfaces";
import { UserDetails } from "./user/userinterfaces";
import { WorkspaceDetails } from "./workspace/workspaceinterfaces";
import { ProcessDetails } from "./process/processinterfaces";
import { InstanceDetails } from "./instance/instanceinterfaces";
import { TodoDetails } from "./todo/todointerfaces";

export interface CoreEnvironment {
  path: PathDetails;
  user: UserDetails;
}

export interface WorkspaceEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;
}

export interface ProcessEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;
  process: ProcessDetails;
}

export interface InstanceEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;
  process: ProcessDetails;
  instance: InstanceDetails;
}

export interface TodoEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;
  process: ProcessDetails;
  instance: InstanceDetails;
  todo: TodoDetails;
}

export function isValidCoreEnvironment(coreEnv: {}, requireUser = true): coreEnv is CoreEnvironment {
  if (coreEnv == null)
    return false;

  if (!requireUser)
    return true;
  else
    return (coreEnv as CoreEnvironment).user != null;
}
export function isValidWorkspaceEnvironment(workspaceEnv: {}, requireUser = true): workspaceEnv is WorkspaceEnvironment {
  return isValidCoreEnvironment(workspaceEnv, requireUser) && (workspaceEnv as WorkspaceEnvironment).workspace != null;
}
export function isValidProcessEnvironment(processEnv: {}, requireUser = true): processEnv is ProcessEnvironment {
  return isValidWorkspaceEnvironment(processEnv, requireUser) && (processEnv as ProcessEnvironment).process != null;
}
export function isValidInstanceEnvironment(instanceEnv: {}, requireUser = true): instanceEnv is InstanceEnvironment {
  return isValidProcessEnvironment(instanceEnv, requireUser) && (instanceEnv as InstanceEnvironment).instance != null;
}
export function isValidTodoEnvironment(todoEnv: {}, requireUser = true): todoEnv is TodoEnvironment {
  return isValidProcessEnvironment(todoEnv, requireUser) && (todoEnv as TodoEnvironment).todo != null;
}