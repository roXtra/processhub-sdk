// Helper functions to filter and/or sort todos
import { TodoDetails, TodoType } from "./todointerfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { UserDetails } from "../user/index";
import { filterInstancesForProcess, filterRemainingInstancesForWorkspace } from "../instance/instancefilters";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";

// Temporary solution during switch from todo.instance -> instances.todos
export function getTodosFromInstances(instances: InstanceDetails[]): TodoDetails[] {
  const todos: TodoDetails[] = [];

  instances.map(instance => {
    if (instance.extras.todos) {
      instance.extras.todos.map(todo => todos.push(todo));
    }
  });

  return todos;
}

// Todos assigned to user
export function filterUserTodos(todos: TodoDetails[], user: UserDetails): TodoDetails[] {
  if (!user || !todos)
    return [];

  const filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.todoType !== TodoType.Simulation) && (todo.userId === user.userId));

  return filteredTodos;
}

// Unassigned todos
export function filterUnassignedTodos(todos: TodoDetails[]): TodoDetails[] {
  if (!todos)
    return [];

  const filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.todoType !== TodoType.Simulation) && (todo.userId == null));

  return filteredTodos;
}

// All todos for an instance
export function filterTodosForInstance(instances: InstanceDetails[], instanceId: string): TodoDetails[] {
  if (!instances)
    return [];

  const todos = getTodosFromInstances(instances);

  const filteredTodos: TodoDetails[] = todos.filter(todo => todo.instanceId === instanceId);
  return filteredTodos;
}

// All todos for a process
export function filterTodosForProcess(instances: InstanceDetails[], processId: string): TodoDetails[] {
  if (!instances)
    return [];

  const filteredInstances = filterInstancesForProcess(instances, processId);

  const filteredTodos = getTodosFromInstances(filteredInstances);
  return filteredTodos;
}

// All todos for workspace
export function filterTodosForWorkspace(instances: InstanceDetails[], workspaceId: string): TodoDetails[] {
  if (!instances)
    return [];

  const todos = getTodosFromInstances(instances);

  const filteredTodos: TodoDetails[] = todos.filter(todo => todo.workspaceId === workspaceId);
  return filteredTodos;
}

// Todos for processes in workspace that user can not see
export function filterRemainingTodosForWorkspace(instances: InstanceDetails[], workspace: WorkspaceDetails): TodoDetails[] {
  if (!instances)
    return [];

  const filteredInstances = filterRemainingInstancesForWorkspace(instances, workspace);

  const workspaceTodos = getTodosFromInstances(filteredInstances);
  return workspaceTodos;
}