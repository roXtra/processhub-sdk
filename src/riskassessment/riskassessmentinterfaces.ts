import { IBaseReply } from "../legacyapi";
import { IRiskAssessment } from "../instance/instanceinterfaces";

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