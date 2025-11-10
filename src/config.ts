import { IModule } from "./modules/imodule.js";
import { IClientSettingsConfig, IFeatureConfig } from "./serverconfig/iconfig.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __INITIAL_CONFIG__: IInitialConfig;
    isTestRun: boolean;
  }
}

/**
 * Returns the backendUrl as defined with Hostname and protocol
 * E.g. http://myhost/Roxtra/modules
 * without trailing slash
 */
export function getBackendUrl(): string {
  if (process.env.API_URL != null) {
    // Defined by webpack => this code is running in the browser
    const base = (document.querySelector("base") || {}).href;
    if (!base) {
      throw new Error("base path must be set!");
    }
    // Trim last slash
    return base.slice(0, -1);
  } else {
    // This code is running on the server
    if (process.env.BACKEND_URL) {
      return process.env.BACKEND_URL;
    } else {
      return "http://localhost:8080";
    }
  }
}

/**
 * Returns the base path as defined in the page without the protocol and the hostname
 * E.g. /Roxtra/modules
 * without trailing slash
 */
export function getBasePath(): string {
  const backendUrl = getBackendUrl();
  const url = new URL(backendUrl);
  // Path contains only the path without host and port
  let path = url.pathname;
  // Trim ending slash
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path.toLowerCase();
}

export interface IUserFieldsConfig {
  fields: {
    caption: string;
    id: string;
    rawcaption: string;
    type: "select" | "string" | "int";
    // Fieldvalueswithcaption is only defined if type is select
    fieldvalueswithcaption?: {
      caption: string;
      rawcaption: string;
      value: string;
    }[];
  }[];
}

export interface IInitialConfig extends IClientSettingsConfig {
  roXtraUrl: string;
  roXtraUrlOriginalCase: string; // Roxtra Base URL in original case from config
  roXtraVersion: string;
  features: IFeatureConfig;
  modules: IModule[];
  /* Is set to true if running in production environment, false if running in development environment. Used for assertions. */
  isProduction: boolean;
  mimeTypes: {
    extensions: string[];
    iconGif: string | undefined;
    iconSvg: string | undefined;
    streamType: string | undefined;
    id: string | undefined;
  }[];
  /* If this is set, it will be used instead of the cookie to identify an user.
  Can be used to execute API calls in the context of another user without getting logged out (anonymous start event)
  or for ui tests where no cookie is set. */
  xAccesstoken?: string;
  /* This token is used to authenticate the user when connecting to websockets */
  webSockettoken?: string;
  defaultServerLanguage: string;
  aiFeaturesAvailable: boolean;
}
