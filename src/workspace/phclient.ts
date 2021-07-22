// Internal objects used by ProcessHub client and server

// WorkspaceView
export const WorkspaceView = {
  Processes: "processes",
  AddProcess: "addprocess",
  Todos: "todos",
  Archive: "archive",
};
export type WorkspaceView = keyof typeof WorkspaceView;

export function isValidWorkspaceView(urlSegment: string): boolean {
  for (const view in WorkspaceView) {
    if ((WorkspaceView as { [viewName: string]: string })[view] === urlSegment.toLowerCase()) return true;
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
