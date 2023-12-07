import Joi from "joi";
import { IGenerateReportRequestType } from "../instance/legacyapi";
import { IBaseRequest, IBaseReply, IBaseRequestObject } from "../legacyapi/apiinterfaces";
import { WorkspaceExtras, IWorkspaceDetails } from "./workspaceinterfaces";
import { IWorkspaceRoles } from "./workspacerights";
import { createLiteralTypeRegExp } from "../data/regextools";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
  UpdateRoles: "/api/workspace/updateroles",
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
export enum RequestedWorkspaceReportType {
  /**
   * Represents a regular workspace report request
   */
  WORKSPACE_REGULAR = 1,
  /**
   * Represents a workspace audit trail report request
   */
  AUDIT_TRAIL = 2,
}

const IGenerateReportRequestTypeOptions = ["docx", "pdf"] as const;

/**
 * Represents common data for Request Report request for workspace
 */
export interface IGenerateReportForWorkspaceCommonData<TYPE extends RequestedWorkspaceReportType> extends IBaseRequest {
  reportType: TYPE;
  workspaceId: string;
  draftId: string;
  resultingFileType: IGenerateReportRequestType;
}

/**
 * Represents a Generate Report request for the regular workspace
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGenerateReportForWorkspaceRequest extends IGenerateReportForWorkspaceCommonData<RequestedWorkspaceReportType.WORKSPACE_REGULAR> {
  // Requires no additional data
}

/**
 * Represents a Generate Report request for the workspace audit trail
*/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGenerateReportForWorkspaceAuditTrailRequest extends IGenerateReportForWorkspaceCommonData<RequestedWorkspaceReportType.AUDIT_TRAIL> {
  // Requires no additional data
}

/**
 * Helper union type for RequestedInstanceReportType
 */
type RequestedWorkspaceReportUnionType = RequestedWorkspaceReportType.WORKSPACE_REGULAR | RequestedWorkspaceReportType.AUDIT_TRAIL;

export type IGenerateWorkspaceReportRequest = IGenerateReportForWorkspaceRequest | IGenerateReportForWorkspaceAuditTrailRequest;

const IGenerateWorkspaceReportRequestObject: IGenerateWorkspaceReportRequest = {
  reportType: Joi.number().valid(RequestedWorkspaceReportType.WORKSPACE_REGULAR, RequestedWorkspaceReportType.AUDIT_TRAIL).required() as unknown as RequestedWorkspaceReportUnionType,
  workspaceId: Joi.string().required() as unknown as string,
  draftId: Joi.string().required() as unknown as string,
  resultingFileType: Joi.string().pattern(createLiteralTypeRegExp(Object.values(IGenerateReportRequestTypeOptions))).required() as unknown as IGenerateReportRequestType,

  // Extends IBaseRequest
  ...IBaseRequestObject,
};

export const IGenerateReportRequestSchema = Joi.object(IGenerateWorkspaceReportRequestObject);