import { UserDetails } from "./userinterfaces";
import { ICoreEnvironment } from "../environment";

export function requireAuthentication(coreEnv: ICoreEnvironment): void {
  if (!coreEnv.user) {
    // No user is logged in - redirect to signin
    if (typeof window !== "undefined") {  // Otherwise fails on server rendering
      window.location.href = "/signin?redirect=" + encodeURIComponent(window.location.pathname);
    } else
      // 401 will result in redirect in renderroute
      throw { error: 401 };
  }
}

// User.lanugage contains the preferred user language, even if it does not (yet) exist
// in ProcessHub (e.g. "fr", if user is french)
// getBestUserLanguage returns the best language for the user that also exists in ProcessHub
export function getBestUserLanguage(user: UserDetails): string {
  // Currently we only have de...
  if (user == null)
    return "de";

  return "de";
}