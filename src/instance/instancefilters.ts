import { IInstanceDetails } from "./instanceinterfaces.js";
import { IUserDetails } from "../user/userinterfaces.js";

// Helper functions to filter and/or sort instances

// instance where the user owns at least one todo
export function filterUserInstances(instances: IInstanceDetails[] | undefined, user?: IUserDetails): IInstanceDetails[] {
  if (!user || !instances) return [];

  const filteredInstances: IInstanceDetails[] = [];

  instances.map((instance) => {
    let instanceAdded = false;
    if (instance.extras.todos && !instance.isSimulation) {
      instance.extras.todos.map((todo) => {
        if (!instanceAdded && todo.userId === user.userId) {
          filteredInstances.push(instance);
          instanceAdded = true;
        }
      });
    }
  });

  return filteredInstances;
}

// All instance for a process
export function filterInstancesForProcess(instances: IInstanceDetails[] | undefined, processId: string): IInstanceDetails[] {
  if (!instances) return [];

  const filteredInstances: IInstanceDetails[] = instances.filter((instance) => instance.processId === processId && !instance.isSimulation);
  return filteredInstances;
}

// All instance for workspace
export function filterInstancesForWorkspace(instances: IInstanceDetails[] | undefined, workspaceId: string): IInstanceDetails[] {
  if (!instances) return [];

  const filteredInstances: IInstanceDetails[] = instances.filter((instance) => instance.workspaceId === workspaceId && !instance.isSimulation);
  return filteredInstances;
}
