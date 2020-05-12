import { IModule, ModuleId } from "./imodule";
import { tl } from "../tl";

export const EForm: IModule = {
  moduleId: ModuleId.EForm,
  urlPrefix: "f",
  name: tl("Elektronische Formulare und Vorgänge"),
};

export const RiskManagement: IModule = {
  moduleId: ModuleId.RiskManagement,
  urlPrefix: "r",
  name: tl("Risikomanagement"),
};

export const modules: IModule[] = [
  EForm,
  RiskManagement
];

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
  return modules.find(m => m.moduleId === ModuleId.EForm);
}