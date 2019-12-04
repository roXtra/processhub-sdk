import { IBaseReply } from "../legacyapi";

export interface IAllAssessmentsFromWorkspaces extends IBaseReply {
  assessments: IWorkspaceAssessment[];
}

export interface IWorkspaceAssessment {
  workspaceId: string;
  assessments: IAssessment[];
}

export interface IAssessment {
  date: Date;
  assessmentId: string;
  assessmentSeverity: number;
  assessmentProbability: number;
}

export interface IRiskAssessmentDimensionEntry {
  name: string;
  value: number;
  entryId: string;
}

export interface IRiskAssessmentDimension {
  name: string;
  dimensionId: string;
  entries: IRiskAssessmentDimensionEntry[];
}

export interface IRiskManagementColorRange {
  from: number;
  to: number;
}

export interface IRiskManagementColors {
  green: IRiskManagementColorRange;
  olive: IRiskManagementColorRange;
  yellow: IRiskManagementColorRange;
  orange: IRiskManagementColorRange;
  red: IRiskManagementColorRange;
}

export interface IRiskManagementProcessSettings {
  dimensions: IRiskAssessmentDimension[];
  colors: IRiskManagementColors;
  hideMatrix: boolean;
}