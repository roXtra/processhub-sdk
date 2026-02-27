// Helper functions to filter and/or sort todos
import { ITodoDetails, TodoType } from "./todointerfaces.js";
import { IInstanceDetails } from "../instance/instanceinterfaces.js";
import { filterInstancesForProcess } from "../instance/instancefilters.js";
import { IUserDetails } from "../user/userinterfaces.js";
import { StateUserDetails } from "../user/phclient.js";

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
export function filterUserTodos(todos: ITodoDetails[] | undefined, user?: IUserDetails | StateUserDetails): ITodoDetails[] {
  if (!user || !todos) return [];

  const filteredTodos: ITodoDetails[] = todos.filter(
    (todo) => todo.todoType !== TodoType.Simulation && todo.todoType !== TodoType.Intermediate && todo.userId === user.userId,
  );

  return filteredTodos;
}

// Unassigned todos
export function filterUnassignedTodos(todos: ITodoDetails[] | undefined): ITodoDetails[] {
  if (!todos) return [];

  const filteredTodos: ITodoDetails[] = todos.filter((todo) => todo.todoType !== TodoType.Simulation && todo.todoType !== TodoType.Intermediate && todo.userId == null);

  return filteredTodos;
}

// All todos for an instance
export function filterTodosForInstance(instances: IInstanceDetails[] | undefined, instanceId: string): ITodoDetails[] {
  if (!instances) return [];

  const todos = getTodosFromInstances(instances);

  const filteredTodos: ITodoDetails[] = todos.filter((todo) => todo.instanceId === instanceId);
  return filteredTodos;
}

// All todos for a process
export function filterTodosForProcess(instances: IInstanceDetails[] | undefined, processId: string): ITodoDetails[] {
  if (!instances) return [];

  const filteredInstances = filterInstancesForProcess(instances, processId);

  const todos = getTodosFromInstances(filteredInstances);

  const filteredTodos: ITodoDetails[] = todos.filter((todo) => todo.todoType !== TodoType.Intermediate);
  return filteredTodos;
}
