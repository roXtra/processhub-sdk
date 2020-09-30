import { IModule, ModuleId } from "./imodule";
import { tl } from "../tl";

export const Processes: IModule = {
  moduleId: ModuleId.Processes,
  urlPrefix: "p",
  name: tl("Prozesse"),
};

export const Risks: IModule = {
  moduleId: ModuleId.Risks,
  urlPrefix: "r",
  name: tl("Risiken"),
};

export const modules: IModule[] = [Processes, Risks];

const modulesById: { [id: number]: IModule } = {};
modules.forEach((m) => (modulesById[m.moduleId] = m));

export function getModule(moduleId: ModuleId): IModule {
  return modulesById[moduleId];
}

export function getModuleForRequestPath(requestPath: string): IModule {
  let prefix = requestPath;
  while (prefix.startsWith("/")) {
    prefix = prefix.substr(1);
  }

  // Look only at first path segment
  prefix = prefix.split("/")[0];

  for (const m of modules) {
    if (m.urlPrefix === prefix) {
      return m;
    }
  }

  // Default module is EFormulare
  return Processes;
}
