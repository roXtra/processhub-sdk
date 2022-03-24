import { strEnum } from "../tools/types.js";
import { WorkspaceView } from "../workspace/phclient.js";
import { ProcessView } from "../process/phclient.js";

export const Page = strEnum(["ErrorPage", "StartPage", "SignupPage", "WorkspacePage", "ProcessPage"]);
export type Page = keyof typeof Page;

export type View = WorkspaceView | ProcessView;

export interface IPathDetails {
  page?: Page;
  view?: View;

  isMobile?: boolean; // Embedded request from a mobile app
  isEmbedded?: boolean; // Embedded view mode (NOT IMPLEMENTED YET)
  isLibraryListing?: boolean; // Process is displayed from the library

  workspaceUrlName?: string;
  processUrlName?: string;
}

export interface INotificationLinkElements {
  workspaceId?: string;
  instanceId?: string;
}
