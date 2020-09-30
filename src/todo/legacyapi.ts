import { IBaseReply, IBaseMessage, IBaseRequest } from "../legacyapi/apiinterfaces";
import { ITodoDetails } from "./todointerfaces";

// API routes
export const TodoRequestRoutes = {
  GetSimulationTodos: "/api/todo/simulationtodos",
  SetPriority: "/api/todo/setpriority",
  DeleteNotificationTodo: "/api/todo/deletenotificationtodo",
  UpdateTodo: "/api/todo/UpdateTodo",
  GetAmountOfUserTodos: "/api/todo/getamountofusertodos",
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
  dueAt: Date;
}
export type IUpdateTodoReply = IBaseReply;

export interface IGetAmountOfUserTodosReply extends IBaseReply {
  todoAmount: number;
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
