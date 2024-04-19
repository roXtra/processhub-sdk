import { IPathDetails } from "./pathinterfaces.js";
import { ApiResult } from "../legacyapi/apiinterfaces.js";

// Internal objects used by ProcessHub client and server

export class PathState {
  currentPath?: IPathDetails;

  lastApiResult?: ApiResult; // Ergebnis des letzten Api-Aufrufs
}
