import { FieldType } from "../data";

// Must match the values defined in Enums_Module.cs in Roxtra.DataProvider
export enum ModuleId {
  None = 0,
  Processes = 1,
  Risks = 2,
  Documents = 3,
  User = 4,
  System = 5,
  Module = 6,
}

export type ModuleName = "documents" | "processes" | "risks" | "user" | "system" | "action" | "audit";

export interface IModule {
  id: number;
  moduleType: ModuleId;
  // Name of module sub type if moduleType === ModuleId.Module; (eg "audit" or "action")
  name?: ModuleName;
  urlPrefix: string;
  // Title of the module, will be displayed to the user (eg "Maßnahmen")
  title: string;
  processName?: string;
}

export interface IGenericModuleSettings {
  defaultStatusField: string | undefined;
  chartFields?: { fieldName: string; type: FieldType }[];
}
