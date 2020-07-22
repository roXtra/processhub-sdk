import { IClientSettingsConfig, IFeatureConfig } from "./serverconfig/iconfig";
import { ModuleId } from "./modules";

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __INITIAL_CONFIG__: IInitialConfig,
    isTestRun: boolean
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
  return path;
}

export interface IInitialConfig extends IClientSettingsConfig {
  roXtraUrl: string;
  roXtraVersion: string;
  features: IFeatureConfig;
  moduleId: ModuleId;
}