import { User } from "oidc-client-ts";

export const authConfig = {
  authority: "/roxtra/auth",
  clientId: "95C33BCB-54B3-4F6E-B247-3F2DBB0FFAA6",
};

function getUser() {
  const itemName = `oidc.user:${authConfig.authority}:${authConfig.clientId}`;
  const oidcStorage = sessionStorage.getItem(itemName);
  if (!oidcStorage) {
    return undefined;
  }
  return User.fromStorageString(oidcStorage);
}

/**
 * Returns the user token that should be used to make requests to the backend.
 * @returns The token that should be used to make requests to the backend
 */
export function getUserToken() {
  if (typeof window !== "undefined") {
    // We have to use the xAccesstoken from the initial config if it is set, because this is the token set for anonymous start events to override the user token
    if (window.__INITIAL_CONFIG__.xAccesstoken) {
      return window.__INITIAL_CONFIG__.xAccesstoken;
    }
    return getUser()?.access_token;
  }

  return undefined;
}
