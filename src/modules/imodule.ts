// Must match the values defined in Enums_Module.cs in Roxtra.DataProvider
export enum ModuleId {
  None = 0,
  EForm = 1,
  RiskManagement = 2,
  DocumentManagement = 3
}

export interface IModule {
  moduleId: ModuleId;
  urlPrefix: string;
  name: string;
}