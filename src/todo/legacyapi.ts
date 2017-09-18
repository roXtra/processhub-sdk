import * as PH from "../";

// API routes 
export const TodoRequestRoutes = {
  GetTodosForUser: "/api/todo/todosforuser",
  UpdateTodo: "/api/todo/updatetodo",
  GetSimulationTodos: "/api/todo/simulationtodos",
};
export type TodoRequestRoutes = keyof typeof TodoRequestRoutes;

export const TodoMessages = {
  TodoLoadedMessage: "TodoLoadedMessage",
  TodoSimulationLoadedMessage: "TodoSimulationLoadedMessage",
};
export type TodoMessages = keyof typeof TodoMessages;

export interface TodoLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: TodoMessages;
  todo?: PH.Todo.TodoDetails;
}

// API request/reply objects
export interface TodoReply extends PH.LegacyApi.BaseMessage {
  errorMessage?: string;
}

export interface GetTodosForUserRequest extends PH.LegacyApi.BaseRequest {
  userId: string;
}

export interface GetTodosForUserReply extends TodoReply {
  todos?: Array<PH.Todo.TodoDetails>;
}

export interface UpdateTodoRequest {
  todo?: PH.Todo.TodoDetails;
}

export interface GetSimulationTodosRequest {
}
export interface GetSimulationTodosReply extends TodoReply {
  todos?: Array<PH.Todo.TodoDetails>;
}

export interface UpdateTodoReply extends TodoReply {
}