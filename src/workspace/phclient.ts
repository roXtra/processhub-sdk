import { IWorkspaceDetails } from "./workspaceinterfaces";

// Internal objects used by ProcessHub client and server

export class WorkspaceState {
  currentWorkspace: IWorkspaceDetails;

  // Workspace Cache
  workspaceCache: {
    [workspaceId: string]: IWorkspaceDetails;
  };

  cacheState?: string;  // Updated in reducers, helps React to detect state changes
  lastDispatchedWorkspace: IWorkspaceDetails; // Used in reducer to detect changes
}

// WorkspaceView
export const WorkspaceView = {
  Riskmanagement: "riskmanagement",
  Processes: "processes",
  AddProcess: "addprocess",
  Todos: "todos"
};
export type WorkspaceView = keyof typeof WorkspaceView;

export function isValidWorkspaceView(urlSegment: string): boolean {
  for (const view in WorkspaceView) {
    if ((WorkspaceView as { [viewName: string]: string })[view] === urlSegment.toLowerCase())
      return true;
  }

  return false;
}

// WorkspaceMessages
export const WorkspaceMessages = {
  WorkspaceLoadedMessage: "WorkspaceLoadedMessage",
  WorkspaceCreatedMessage: "WorkspaceCreatedMessage",
  WorkspaceUpdatedMessage: "WorkspaceUpdatedMessage",
  WorkspaceDeletedMessage: "WorkspaceDeletedMessage",
};
export type WorkspaceMessages = keyof typeof WorkspaceMessages;
