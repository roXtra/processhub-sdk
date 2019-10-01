import { InstanceDetails } from "./instanceinterfaces";
import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";

// Helper functions to filter and/or sort instances

// instance where the user owns at least one todo
export function filterUserInstances(instances: InstanceDetails[], user: UserDetails): InstanceDetails[] {
  if (!user || !instances)
    return [];

  const filteredInstances: InstanceDetails[] = [];

  instances.map(instance => {
    const instanceAdded = false;
    if (instance.extras.todos && !instance.isSimulation) {
      instance.extras.todos.map(todo => {
        if (!instanceAdded && (todo.userId === user.userId))
          filteredInstances.push(instance);
      });
    }
  });

  return filteredInstances;
}

export function filterSingleInstance(instances: InstanceDetails[], instanceId: string): InstanceDetails {
  if (!instances)
    return null;

  return instances.find(instance => instance.instanceId === instanceId && !instance.isSimulation);
}

// All instance for a process
export function filterInstancesForProcess(instances: InstanceDetails[], processId: string): InstanceDetails[] {
  if (!instances)
    return [];

  const filteredInstances: InstanceDetails[] = instances.filter(instance => instance.processId === processId && !instance.isSimulation);
  return filteredInstances;
}

// All instance for workspace
export function filterInstancesForWorkspace(instances: InstanceDetails[], workspaceId: string): InstanceDetails[] {
  if (!instances)
    return [];

  const filteredInstances: InstanceDetails[] = instances.filter(instance => instance.workspaceId === workspaceId && !instance.isSimulation);
  return filteredInstances;
}

// Instances for processes in workspace that user can not see
export function filterRemainingInstancesForWorkspace(instances: InstanceDetails[], workspace: WorkspaceDetails): InstanceDetails[] {
  if (!instances)
    return [];

  let workspaceInstances = filterInstancesForWorkspace(instances, workspace.workspaceId);

  if (workspace.extras.processes) {
    // GetOtherItems lists the todos for processes without read access - filter the others
    const filteredInstances: InstanceDetails[] = [];
    workspaceInstances.map(instance => {
      if (workspace.extras.processes.find(process => process.processId === instance.processId) == null) {
        filteredInstances.push(instance);
      }
    });
    workspaceInstances = filteredInstances;
  }

  return workspaceInstances;
}