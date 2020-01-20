import { IModule, ModuleId } from "./imodule";
import { tl } from "../tl";

export const modules: IModule[] = [
  {
    moduleId: ModuleId.EForm,
    urlPrefix: "",
    name: tl("Elektronische Formulare und Vorgänge"),
  },
  {
    moduleId: ModuleId.RiskManagement,
    urlPrefix: "riskmanagement",
    name: tl("Risikomanagement"),
  }
];

export function getModuleForRequestPath(requestPath: string): IModule {
  let prefix = requestPath;
  while (prefix.startsWith("/")) {
    prefix = prefix.substr(1);
  }
  // Remove area id
  prefix = prefix.split("@")[0];

  while (prefix.endsWith("/")) {
    prefix = prefix.substr(0, prefix.length - 1);
  }

  for (const m of modules) {
    if (m.urlPrefix === prefix) {
      return m;
    }
  }

  // Default module is EFormulare
  return modules.find(m => m.moduleId === ModuleId.EForm);
}