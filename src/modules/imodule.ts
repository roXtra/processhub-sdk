// Must match the values defined in Enums_Module.cs in Roxtra.DataProvider
export enum ModuleId {
  None = 0,
  Processes = 1,
  Risks = 2,
  Documents = 3,
}

export interface IModule {
  moduleId: ModuleId;
  urlPrefix: string;
  name: string;
}
