import { IClientSettingsConfig, IFeatureConfig } from "./serverconfig/iconfig";
import { ModuleId } from "./modules";

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window { __INITIAL_CONFIG__: IInitialConfig }
}

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
 * E.g. /Roxtra/modules/eform/
 */
export function getBasePath(): string {
  const backendUrl = getBackendUrl();
  const strippedBackendUrl = backendUrl.replace("http://", "").replace("https://", "");
  const firstSlash = strippedBackendUrl.indexOf("/");
  const backendBasePath = strippedBackendUrl.substring(firstSlash);
  return backendBasePath;
}

export interface IInitialConfig extends IClientSettingsConfig {
  roXtraUrl: string;
  roXtraVersion: string;
  features: IFeatureConfig;
  moduleId: ModuleId;
}