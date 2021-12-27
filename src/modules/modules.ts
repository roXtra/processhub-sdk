import { IModule, ModuleId } from "./imodule";

export const Processes: IModule = {
  id: ModuleId.Processes,
  moduleType: ModuleId.Processes,
  urlPrefix: "p",
  /* @deprecated user getModule(ModuleId.Processes).title to get the correct title */
  title: "Prozesse",
  name: "processes",
};

export const Risks: IModule = {
  id: ModuleId.Risks,
  moduleType: ModuleId.Risks,
  urlPrefix: "r",
  /* @deprecated user getModule(ModuleId.Risks).title to get the correct title */
  title: "Risiken",
  processName: "riskmanagement",
  name: "risks",
};

let modules: IModule[] = [Processes, Risks];
const modulesById: { [id: number]: IModule } = {};
modules.forEach((m) => (modulesById[m.id] = m));

export function initiateModules(newModules: Array<IModule>): void {
  modules = newModules;
  modules.forEach((m) => (modulesById[m.id] = m));
}

export function getModule(moduleId: number): IModule {
  return modulesById[moduleId];
}

export function getModules(): IModule[] {
  return modules;
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

  // Default module is Processes
  return Processes;
}
