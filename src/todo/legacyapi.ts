import { IBaseReply, IBaseMessage, IBaseRequest } from "../legacyapi/apiinterfaces.js";
import { ITodoDetails } from "./todointerfaces.js";

// API routes
export const TodoRequestRoutes = {
  GetSimulationTodos: "/api/todo/simulationtodos",
  SetPriority: "/api/todo/setpriority",
  DeleteNotificationTodo: "/api/todo/deletenotificationtodo",
  UpdateTodo: "/api/todo/UpdateTodo",
  GetAmountOfUserTodos: "/api/todo/getamountofusertodos",
  /**
   * Returns all todos for the current user, for all modules. For risk management, only assessment todos are returned.
   */
  GetUserTodos: "/api/todo/getusertodos",
};
export type TodoRequestRoutes = keyof typeof TodoRequestRoutes;

export const TodoMessages = {
  TodoSimulationLoadedMessage: "TodoSimulationLoadedMessage",
};
export type TodoMessages = keyof typeof TodoMessages;

// API request/reply objects
export interface ITodoReply extends IBaseMessage {
  errorMessage?: string;
}

export interface IGetSimulationTodosRequest extends IBaseRequest {
  workspaceId: string;
  instanceId: string;
}
export interface IGetSimulationTodosReply extends ITodoReply {
  todos?: Array<ITodoDetails>;
}

export interface IUpdateTodoRequest extends IBaseRequest {
  workspaceId: string;
  todoId: string;
  dueAt: Date | undefined;
}
export type IUpdateTodoReply = IBaseReply;

export interface IGetAmountOfUserTodosReply extends IBaseReply {
  // Total amount of todos for the user (including overdue)
  todoAmount: number;
  // Amount of todos that are overdue
  overdueTodoAmount: number;
}

export interface ISetTodoPriorityRequest extends IBaseRequest {
  workspaceId: string;
  todoId: string;
  priority: number;
}
export type ISetTodoPriorityReply = IBaseReply;

export interface IDeleteNotificationTodoRequest extends IBaseRequest {
  workspaceId: string;
  todoId: string;
}
export type IDeleteNotificationTodoReply = IBaseReply;

export interface IGetUserTodosReply extends IBaseReply {
  todos: (Pick<ITodoDetails, "todoId" | "todoType" | "userId" | "displayName" | "description" | "createdAt" | "dueAt" | "instanceId"> & {
    moduleId: number;
    instanceDisplayName: string;
    workspaceDisplayName: string;
    processDisplayName: string;
    instanceStartedByUserId: string | undefined;
    instanceUrl: string;
  })[];
}
