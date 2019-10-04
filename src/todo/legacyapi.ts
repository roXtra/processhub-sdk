import { IBaseReply, IBaseMessage } from "../legacyapi/apiinterfaces";
import { ITodoDetails } from "./todointerfaces";

// API routes
export const TodoRequestRoutes = {
  GetSimulationTodos: "/api/todo/simulationtodos",
  SetPriority: "/api/todo/setpriority",
  DeleteNotificationTodo: "/api/todo/deletenotificationtodo",
  UpdateTodo: "/api/todo/UpdateTodo",
  GetAmountOfUserTodos: "/api/todo/getamountofusertodos"
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

export interface IGetSimulationTodosRequest {
  workspaceId: string;
  instanceId: string;
}
export interface IGetSimulationTodosReply extends ITodoReply {
  todos?: Array<ITodoDetails>;
}

export interface IUpdateTodoRequest {
  workspaceId: string;
  todoId: string;
  dueAt: Date;
}
export interface IUpdateTodoReply extends IBaseReply  {
}

export interface IGetAmountOfUserTodosRequest {
}
export interface IGetAmountOfUserTodosReply extends IBaseReply  {
  todoAmount: number;
}

export interface ISetTodoPriorityRequest {
  workspaceId: string;
  todoId: string;
  priority: number;
}
export interface ISetTodoPriorityReply extends IBaseReply  {
}

export interface IDeleteNotificationTodoRequest {
  workspaceId: string;
  todoId: string;
}
export interface IDeleteNotificationTodoReply extends IBaseReply  {
}