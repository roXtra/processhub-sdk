import { IClientSettingsConfig, IFeatureConfig } from "./serverconfig/iconfig";
import { ModuleId } from "./modules";

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window { __INITIAL_CONFIG__: IInitialConfig }
}

export function getBackendUrl(): string {
  if (process.env.API_URL != null) {
    // Defined by webpack => this code is running in the browser
    const splittedUrl = window.location.href.split("/");
    return splittedUrl[0] + "//" + splittedUrl[2];
  } else {
    // This code is running on the server
    if (process.env.BACKEND_URL) {
      return process.env.BACKEND_URL;
    } else {
      return "http://localhost:8080";
    }
  }
}

export interface IInitialConfig extends IClientSettingsConfig {
  roXtraUrl: string;
  roXtraVersion: string;
  features: IFeatureConfig;
  moduleId: ModuleId;
}