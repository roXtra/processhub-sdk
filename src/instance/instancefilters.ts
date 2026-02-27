import { IInstanceDetails } from "./instanceinterfaces.js";
import { IUserDetails } from "../user/userinterfaces.js";

// Helper functions to filter and/or sort instances

// instance where the user owns at least one todo
export function filterUserInstances(instances: IInstanceDetails[] | undefined, user?: IUserDetails): IInstanceDetails[] {
  if (!user || !instances) return [];

  const filteredInstances: IInstanceDetails[] = [];

  instances.map((instance) => {
    if (instance.extras.todos && !instance.isSimulation) {
      const hasUserTodo = instance.extras.todos.some((todo) => todo.userId === user.userId);
      if (hasUserTodo) {
        filteredInstances.push(instance);
      }
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
