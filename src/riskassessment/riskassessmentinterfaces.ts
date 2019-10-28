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