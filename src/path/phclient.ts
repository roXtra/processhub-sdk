import { IPathDetails } from "./pathinterfaces";
import { ApiResult } from "../legacyapi/apiinterfaces";

// Internal objects used by ProcessHub client and server

export class PathState {
  currentPath: IPathDetails;

  lastApiResult?: ApiResult; // Ergebnis des letzten Api-Aufrufs
}
