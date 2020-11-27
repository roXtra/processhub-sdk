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

export interface IModule {
  id: number;
  moduleType: ModuleId;
  urlPrefix: string;
  name: string;
  processName?: string;
}
