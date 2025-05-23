import { getBasePath } from "../config.js";
import { Language, tl } from "../tl.js";
import { IModule, ModuleId, ModuleName } from "./imodule.js";

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

export function getModuleTitle(moduleName: ModuleName, locale: Language): string {
  switch (moduleName) {
    case "documents":
      return tl("Dokumente", locale);
    case "processes":
      return tl("Prozesse", locale);
    case "risks":
      return tl("Risiken", locale);
    case "user":
      return tl("Benutzer", locale);
    case "system":
      return tl("System", locale);
    case "action":
      return tl("Maßnahmen Plus", locale);
    case "action_basic":
      return tl("Maßnahmen", locale);
    case "audit":
      return tl("Audit", locale);
    case "reclamations":
      return tl("Reklamationen", locale);
  }
}

export function getInstanceTitleByModule(moduleName: ModuleName, locale: Language): string | undefined {
  switch (moduleName) {
    case "processes":
      return tl("Vorgang", locale);
    case "risks":
      return tl("Risiko", locale);
    case "action":
    case "action_basic":
      return tl("Maßnahme", locale);
    case "audit":
      return tl("Audit", locale);
    case "reclamations":
      return tl("Reklamation", locale);
    case "system":
    case "user":
    case "documents":
      return undefined;
  }
}

export function getModule(moduleId: number): IModule {
  return modulesById[moduleId];
}

export function getModules(): IModule[] {
  return modules;
}

const modulesByPath: { [path: string]: IModule | undefined } = {};

export function getModuleForRequestPath(requestPath: string): IModule {
  if (modulesByPath[requestPath] !== undefined) {
    return modulesByPath[requestPath] as IModule;
  }
  const module = getModule(requestPath);
  modulesByPath[requestPath] = module;
  return module;

  function getModule(requestPath: string): IModule {
    if (requestPath.toLowerCase().startsWith(getBasePath().toLowerCase())) {
      requestPath = requestPath.substring(getBasePath().length);
    }

    let prefix = requestPath;
    while (prefix.startsWith("/")) {
      prefix = prefix.substring(1);
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
}
