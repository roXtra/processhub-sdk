import Joi from "joi";
import { IRiskAssessment } from "../instance/instanceinterfaces.js";
import { IBaseReply } from "../legacyapi/apiinterfaces.js";

export enum RiskAssessmentCycle {
  // Explicit values that may not be changed as this is stored in the DB
  Monthly = 1,
  Quarterly = 2,
  HalfYearly = 3,
  Yearly = 4,
  BiYearly = 5,
}

export const RiskAssessmentCycleSchema = Joi.number().max(5).min(1).integer();

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
  name: string;
}

export interface IRiskManagementProcessSettings {
  dimensions: IRiskAssessmentDimension[];
  // JavaScript expression to calculate the risk metrics
  metricsExpression: string | undefined;
  colors: IRiskManagementColor[];
  hideMatrix: boolean;
  defaultRPZField: string | undefined;
}
