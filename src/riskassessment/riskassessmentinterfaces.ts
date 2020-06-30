import { IBaseReply } from "../legacyapi";
import { IRiskAssessment } from "../instance/instanceinterfaces";

export enum RiskAssessmentCycle {
  // Explicit values that may not be changed as this is stored in the DB
  Monthly = 1,
  Quarterly = 2,
  HalfYearly = 3,
  Yearly = 4,
  BiYearly = 5,
}

export interface IAllAssessmentsFromWorkspaces extends IBaseReply {
  assessments: IWorkspaceAssessment[];
}

export interface IWorkspaceAssessment {
  workspaceId: string;
  assessments: IRiskAssessment[];
}

export interface IRiskAssessmentDimensionEntry {
  name: string;
  value: number;
  color: string;
  entryId: string;
}

export interface IRiskAssessmentDimension {
  name: string;
  dimensionId: string;
  entries: IRiskAssessmentDimensionEntry[];
}

export interface IRiskManagementColor {
  from: number;
  to: number;
  code: string;
}

export interface IRiskManagementProcessSettings {
  dimensions: IRiskAssessmentDimension[];
  colors: IRiskManagementColor[];
  hideMatrix: boolean;
}