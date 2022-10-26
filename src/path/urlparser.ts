import { IPathDetails, Page, INotificationLinkElements } from "./pathinterfaces";
import { isTrue } from "../tools/assert";
import { ProcessView, isValidProcessView } from "../process/phclient";
import { WorkspaceView, isValidWorkspaceView } from "../workspace/phclient";
import { isId } from "../tools/guid";
import { getBackendUrl, getBasePath } from "../config";

export const AuditsOfflineRoute = "audits-offline";

export function parseUrl(fullUrlWithBase: string): IPathDetails | undefined {
  const path: IPathDetails = {};
  const backendUrl = getBackendUrl().toLowerCase();
  const fullUrl = fullUrlWithBase !== undefined ? fullUrlWithBase.toLowerCase().replace(backendUrl, "") : "";

  // Split path
  isTrue(fullUrl.substr(0, 1) === "/", "Url doesn't start with /");
  let url = fullUrl.toLowerCase().substr(1);
  if (url.endsWith("/"))
    // Ignore "/" on end
    url = url.substr(0, url.length - 1);
  const split = url.split("/");

  // Url is f/... for module f

  // Pages not related to workspace
  let part = split[1];
  if (part == null || (part === "" && split.length === 2) || (part === "profile" && split.length === 2) || (part === "i" && split.length >= 3)) {
    // Instance and Todo-links are handled on StartPage
    path.page = Page.StartPage;
    return path;
  } else if (part === "signup" && split.length === 2) {
    path.page = Page.SignupPage;
    return path;
  } else if (part === AuditsOfflineRoute && split.length === 2) {
    path.page = Page.AuditsOffline;
    return path;
  } else if (!part.startsWith("@")) {
    return undefined;
  }

  // ...otherwise workspace or riskmanagement must follow

  // -> Workspace
  path.workspaceUrlName = part.substr(1);

  part = split.length >= 3 ? split[2] : WorkspaceView.Processes;
  if (isValidWorkspaceView(part) && split.length <= 3) {
    path.page = Page.WorkspacePage;
    path.view = part as WorkspaceView;
    return path;
  } else if (part === ProcessView.NewProcess) {
    path.page = Page.ProcessPage;
    path.view = part as ProcessView;
    return path;
  } else if (part !== "p" || split.length < 4) {
    // ...otherwise process must follow
    return undefined;
  }

  // -> Process
  path.processUrlName = decodeURIComponent(split[3]);

  part = split.length >= 5 ? split[4] : ProcessView.Show;
  if (isValidProcessView(part) && split.length <= 5) {
    path.page = Page.ProcessPage;
    path.view = part as ProcessView;
    return path;
  } else return undefined;
}

export function parseNotificationLink(fullUrlWithBase: string): INotificationLinkElements {
  const elements: INotificationLinkElements = {};
  const basePath = getBasePath().toLowerCase();
  const fullUrl = fullUrlWithBase !== undefined ? fullUrlWithBase.toLowerCase().replace(basePath, "") : "";

  // Split path
  isTrue(fullUrl.substr(0, 1) === "/", "Url doesn't start with /");
  let url = fullUrl.toLowerCase().substr(1);
  if (url.endsWith("/"))
    // Ignore "/" on end
    url = url.substr(0, url.length - 1);
  const split = url.split("/");

  // Index 0 is the module, e.g. f or riskmanagement (f/i/...)
  const index = 1;

  if (split[index] !== "i" || split.length < 3) return elements;

  let nextPart = split[index + 1];
  if (nextPart.substr(0, 1) === "@") {
    // Old links had workspaceUrl - ignore
  } else {
    elements.workspaceId = nextPart;
  }

  if (split.length === 3) return elements;

  nextPart = split[index + 2];
  if (!isId(nextPart.toUpperCase())) return elements;
  else elements.instanceId = nextPart.toUpperCase();

  return elements;
}
