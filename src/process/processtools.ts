import { IProcessDetails, ProcessViewAccess } from "./processinterfaces";
import { parseIdMailAddress } from "../instance/instancetools";
import * as Config from "../config";
import { isId } from "../tools/guid";

export function parseProcessMailSubject(mail: string): string {
  const regex = /(\[)(p-)(.*?)(\])/gm;
  let match: RegExpExecArray;

  while ((match = regex.exec(mail)) != null) {
    let maybeId: string = match[3];
    maybeId = maybeId.toUpperCase();
    if (isId(maybeId)) {
      return maybeId;
    }
  }
  return null;
}
export function parseProcessMailAddress(mail: string): string {
  return parseIdMailAddress("p-", mail);
}
export function getProcessMailAddress(processId: string): string {
  if (Config.getBackendUrl() === "http://localhost:8080")
    return "p-" + processId.toLowerCase() + "@testmail.processhub.com";
  else
    return "p-" + processId.toLowerCase() + "@mail.processhub.com";
}

// Init settings that don't exist with default values
export function initSettings(process: IProcessDetails): void {
  if (!process.extras.settings)
    process.extras.settings = {};

  const settings = process.extras.settings;

  if (!settings.dashboard)
    settings.dashboard = {};
  if (!settings.dashboard.dashBoardAccess)
    settings.dashboard.dashBoardAccess = ProcessViewAccess.WorkspaceMembersSeeAll; // Default

  if (!settings.library)
    settings.library = {};
}