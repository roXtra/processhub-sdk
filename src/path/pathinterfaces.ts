import { strEnum } from "../tools/types";
import { WorkspaceView } from "../workspace/phclient";
import { ProcessView } from "../process/phclient";

export const Page = strEnum(["AuditsOffline", "ErrorPage", "StartPage", "SignupPage", "WorkspacePage", "ProcessPage"]);
export type Page = keyof typeof Page;

export type View = WorkspaceView | ProcessView;

export interface IPathDetails {
  page?: Page;
  view?: View;

  workspaceUrlName?: string;
  processUrlName?: string;
}

export interface INotificationLinkElements {
  workspaceId?: string;
  instanceId?: string;
}
