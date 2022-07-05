// Internal objects used by ProcessHub client and server

// WorkspaceView
export const WorkspaceView = {
  Processes: "processes",
  AddProcess: "addprocess",
  Todos: "todos",
  Archive: "archive",
  Edit: "edit",
  Statistics: "statistics",
  Profile: "profile",
};
export type WorkspaceView = keyof typeof WorkspaceView;

export function isValidWorkspaceView(urlSegment: string): boolean {
  for (const view in WorkspaceView) {
    if ((WorkspaceView as { [viewName: string]: string })[view] === urlSegment.toLowerCase()) return true;
  }

  return false;
}
