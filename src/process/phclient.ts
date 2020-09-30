export const ProcessView = {
  // Will be used for urlSegments, so elements in lower case
  Show: "show",
  Edit: "edit",
  Dashboard: "dashboard",
  NewProcess: "newprocess",
  Instances: "instances",
  Statistics: "statistics",
};
export type ProcessView = keyof typeof ProcessView;

export function isValidProcessView(urlSegment: string): boolean {
  for (const view in ProcessView) {
    if ((ProcessView as { [name: string]: string })[view] === urlSegment.toLowerCase()) return true;
  }

  return false;
}

export interface IRowDetails {
  rowNumber: number;
  selectedRole: string;
  task: string;
  taskId: string;
  laneId: string;
  taskType: "bpmn:UserTask" | "bpmn:SendTask" | "bpmn:StartEvent";
  jumpsTo: string[];
}
