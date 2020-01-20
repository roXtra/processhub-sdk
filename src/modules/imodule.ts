export enum ModuleId {
  EForm = 1,
  RiskManagement = 2
}

export interface IModule {
  moduleId: ModuleId;
  urlPrefix: string;
  name: string;
}