import Joi from "joi";
import { IGenerateReportRequestType, RequestedReportType } from "../instance/legacyapi.js";
import { IBaseRequest, IBaseReply, IBaseRequestObject } from "../legacyapi/apiinterfaces.js";
import { WorkspaceExtras, IWorkspaceDetails } from "./workspaceinterfaces.js";
import { IWorkspaceRoles } from "./workspacerights.js";
import { createLiteralTypeRegExp } from "../data/regextools.js";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
  UpdateRoles: "/api/workspace/updateroles",
  GenerateReport: "/api/workspace/generatereport",
};
export type WorkspaceRequestRoutes = keyof typeof WorkspaceRequestRoutes;

export interface ILoadWorkspaceRequest extends IBaseRequest {
  workspaceId: string;
  getExtras: WorkspaceExtras;
}
export interface ILoadWorkspaceReply extends IBaseReply {
  workspace?: IWorkspaceDetails;
}
export interface IUpdateWorkspaceRolesRequest extends IBaseRequest {
  workspaceId: string;
  workspaceRoles: IWorkspaceRoles;
}
export interface IUpdateWorkspaceRolesReply extends IBaseReply {
  workspace?: IWorkspaceDetails;
}

const IGenerateReportRequestTypeOptions = ["docx", "pdf"] as const;

/**
 * Represents common data for Request Report request for workspace
 */
export interface IGenerateReportForWorkspaceCommonData<TYPE extends RequestedReportType> extends IBaseRequest {
  reportType: TYPE;
  workspaceId: string;
  draftId: string;
  resultingFileType: IGenerateReportRequestType;
}

/**
 * Represents a Generate Report request for the workspace audit trail
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGenerateReportForWorkspaceAuditTrail extends IGenerateReportForWorkspaceCommonData<RequestedReportType.WORKSPACE_AUDIT_TRAIL> {
  // No additional data needed
}

/**
 * Helper union type for RequestedInstanceReportType
 */
type RequestedWorkspaceReportUnionType = RequestedReportType.WORKSPACE_AUDIT_TRAIL;

export type IGenerateWorkspaceReportRequest = IGenerateReportForWorkspaceAuditTrail;

const IGenerateWorkspaceReportRequestObject: IGenerateWorkspaceReportRequest = {
  reportType: Joi.number().valid(RequestedReportType.WORKSPACE_AUDIT_TRAIL).required() as unknown as RequestedWorkspaceReportUnionType,
  workspaceId: Joi.string().required() as unknown as string,
  draftId: Joi.string().required() as unknown as string,
  resultingFileType: Joi.string()
    .pattern(createLiteralTypeRegExp(Object.values(IGenerateReportRequestTypeOptions)))
    .required() as unknown as IGenerateReportRequestType,

  // Extends IBaseRequest
  ...IBaseRequestObject,
};

export const IGenerateWorkspaceReportRequestSchema = Joi.object(IGenerateWorkspaceReportRequestObject);
