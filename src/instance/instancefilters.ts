import { IInstanceDetails } from "./instanceinterfaces";
import { IUserDetails } from "../user/userinterfaces";
import { IWorkspaceDetails, StateWorkspaceDetails } from "../workspace/workspaceinterfaces";
import { IProcessDetails } from "../process/processinterfaces";

// Helper functions to filter and/or sort instances

// instance where the user owns at least one todo
export function filterUserInstances(instances: IInstanceDetails[], user?: IUserDetails): IInstanceDetails[] {
  if (!user || !instances) return [];

  const filteredInstances: IInstanceDetails[] = [];

  instances.map((instance) => {
    const instanceAdded = false;
    if (instance.extras.todos && !instance.isSimulation) {
      instance.extras.todos.map((todo) => {
        if (!instanceAdded && todo.userId === user.userId) filteredInstances.push(instance);
      });
    }
  });

  return filteredInstances;
}

export function filterSingleInstance(instances: IInstanceDetails[], instanceId: string): IInstanceDetails | undefined {
  if (!instances) return undefined;

  return instances.find((instance) => instance.instanceId === instanceId && !instance.isSimulation);
}

// All instance for a process
export function filterInstancesForProcess(instances: IInstanceDetails[], processId: string): IInstanceDetails[] {
  if (!instances) return [];

  const filteredInstances: IInstanceDetails[] = instances.filter((instance) => instance.processId === processId && !instance.isSimulation);
  return filteredInstances;
}

// All instance for workspace
export function filterInstancesForWorkspace(instances: IInstanceDetails[], workspaceId: string): IInstanceDetails[] {
  if (!instances) return [];

  const filteredInstances: IInstanceDetails[] = instances.filter((instance) => instance.workspaceId === workspaceId && !instance.isSimulation);
  return filteredInstances;
}

// Instances for processes in workspace that user can not see
export function filterRemainingInstancesForWorkspace(
  instances: IInstanceDetails[],
  workspace: IWorkspaceDetails | StateWorkspaceDetails,
  workspaceProcesses: IProcessDetails[] | undefined,
): IInstanceDetails[] {
  if (!instances) return [];

  let workspaceInstances = filterInstancesForWorkspace(instances, workspace.workspaceId);

  // GetOtherItems lists the todos for processes without read access - filter the others
  if (workspaceProcesses) {
    const filteredInstances: IInstanceDetails[] = [];
    workspaceInstances.map((instance) => {
      if (workspaceProcesses?.find((process) => process.processId === instance.processId) == null) {
        filteredInstances.push(instance);
      }
    });
    workspaceInstances = filteredInstances;
  }

  return workspaceInstances;
}
