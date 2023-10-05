// Helper functions to filter and/or sort todos
import { ITodoDetails, TodoType } from "./todointerfaces";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { filterInstancesForProcess } from "../instance/instancefilters";
import { IUserDetails } from "../user/userinterfaces";
import { StateUserDetails } from "../user/phclient";

// Temporary solution during switch from todo.instance -> instances.todos
export function getTodosFromInstances(instances: IInstanceDetails[]): ITodoDetails[] {
  const todos: ITodoDetails[] = [];

  instances.map((instance) => {
    if (instance.extras.todos) {
      instance.extras.todos.map((todo) => todos.push(todo));
    }
  });

  return todos;
}

// Todos assigned to user
export function filterUserTodos(todos: ITodoDetails[], user: IUserDetails | StateUserDetails): ITodoDetails[] {
  if (!user || !todos) return [];

  const filteredTodos: ITodoDetails[] = todos.filter((todo) => todo.todoType !== TodoType.Simulation && todo.userId === user.userId);

  return filteredTodos;
}

// Unassigned todos
export function filterUnassignedTodos(todos: ITodoDetails[]): ITodoDetails[] {
  if (!todos) return [];

  const filteredTodos: ITodoDetails[] = todos.filter((todo) => todo.todoType !== TodoType.Simulation && todo.userId == null);

  return filteredTodos;
}

// All todos for an instance
export function filterTodosForInstance(instances: IInstanceDetails[], instanceId: string): ITodoDetails[] {
  if (!instances) return [];

  const todos = getTodosFromInstances(instances);

  const filteredTodos: ITodoDetails[] = todos.filter((todo) => todo.instanceId === instanceId);
  return filteredTodos;
}

// All todos for a process
export function filterTodosForProcess(instances: IInstanceDetails[], processId: string): ITodoDetails[] {
  if (!instances) return [];

  const filteredInstances = filterInstancesForProcess(instances, processId);

  const filteredTodos = getTodosFromInstances(filteredInstances);
  return filteredTodos;
}
