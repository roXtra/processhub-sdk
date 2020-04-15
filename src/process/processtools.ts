import { IProcessDetails, ProcessViewAccess } from "./processinterfaces";
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

// Init settings that don't exist with default values
export function initSettings(process: IProcessDetails): void {
  if (!process.extras.settings)
    process.extras.settings = {};

  const settings = process.extras.settings;

  if (!settings.dashboard)
    settings.dashboard = {};
  if (!settings.dashboard.dashBoardAccess)
    settings.dashboard.dashBoardAccess = ProcessViewAccess.ParticipantsSeeTheirs; // Default

  if (!settings.library)
    settings.library = {};
}