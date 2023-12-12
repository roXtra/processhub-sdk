import { IBaseReply, IBaseMessage, IBaseRequest, IBaseRequestObject, IBaseReplyObject } from "../legacyapi/apiinterfaces";
import { IInstanceDetails, IResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";
import Joi from "joi";
import { createLiteralTypeRegExp } from "../data/regextools";
import { IUserDetails } from "../user/userinterfaces";
import { IFieldContentMap } from "../data/ifieldcontentmap";
import { IRoleOwnerMap } from "../process/processrights";
import { IStatisticsChartDetails, IStatisticsChartObject } from "../data/statistics";

// API routes
export const ProcessEngineApiRoutes = {
  execute: "/api/processengine/execute",
  resume: "/api/processengine/resume",
  updateInstance: "/api/processengine/updateInstance",
  abort: "/api/processengine/abort",
  jump: "/api/processengine/jump",
  getInstanceDetails: "/api/processengine/getinstancedetails",
  uploadAttachment: "/api/processengine/uploadattachment",
  updateRoxFile: "/api/processengine/uploadroxfile",
  deleteAttachment: "/api/processengine/deleteattachment",
  comment: "/api/processengine/comment",
  deleteComment: "/api/processengine/deletecomment",
  deleteMail: "/api/processengine/deletemail",
  deleteInstances: "/api/processengine/deleteinstances",
  uploadCommentAttachment: "/api/processengine/uploadcommentattachment",
  setFieldContent: "/api/processengine/setfieldcontent",
  getArchive: "/api/processengine/getarchive",
  exportAuditTrail: "/api/processengine/exportaudittrail",
  generateReport: "/api/processengine/generatereport",
  convertSpreadsheets: "/api/processengine/convertspreadsheets",
  getroxfilelinkreferences: "/api/processengine/getroxfilelinkreferences",
  setStartEventReferences: "/api/processengine/setstarteventreferences",
  copyFields: "/api/processengine/copyfields",
  rightsOwners: "/api/processengine/rightsowners",
};

export type ProcessEngineApiRoutes = keyof typeof ProcessEngineApiRoutes;

// API request/reply objects
export interface IInstanceReply extends IBaseReply {
  errorMessage?: string;
}

const IInstanceReplyObject: IInstanceReply = {
  errorMessage: Joi.string().allow("") as unknown as string,
  // Extends IBaseReply
  ...IBaseReplyObject,
};

export const IInstanceReplySchema = Joi.object(IInstanceReplyObject);

export interface IExecuteRequest extends IBaseRequest {
  processId: string;
  instance?: IInstanceDetails;
  startEventId?: string;
}
export interface IExecuteReply extends IInstanceReply {
  // ExecuteReply ist das selbe wie ResumeReply
  // instanceId is obsolete as the whole instance is returned but may not be removed from the stable API
  instanceId: string;
  instance: IInstanceDetails;
}

export interface IConvertSpreadsheetsRequest extends IBaseRequest {
  processId: string;
}

export interface IUpdateInstanceRequest extends IBaseRequest {
  instance: IInstanceDetails;
  // Used to create an audit trail entry if the updateInstance request was made by offline mode
  initiator?: "offlinemode";
}
export interface IUpdateInstanceReply extends IInstanceReply {
  instance?: IInstanceDetails;
}

export interface IResumeRequest extends IBaseRequest {
  resumeDetails: IResumeInstanceDetails;
}

export interface IAbortRequest extends IBaseRequest {
  instanceId: string;
}
export type IAbortReply = IInstanceReply;

export interface IJumpRequest extends IBaseRequest {
  instanceId: string;
  targetBpmnTaskId: string;
  resumeDetails: IResumeInstanceDetails;
}
export type IJumpReply = IInstanceReply;

export interface IGetInstanceDetailsRequest extends IBaseRequest {
  instanceId: string;
  getExtras: InstanceExtras;
}
export interface IGetInstanceDetailsReply extends IInstanceReply {
  instanceDetails?: IInstanceDetails;
}

export interface IUploadAttachmentRequest extends IBaseRequest {
  instanceId: string;
  file: { filename: string; headers: { [key: string]: string }; payload: Buffer };
}
export interface IUploadAttachmentReply extends IInstanceReply {
  url: string;
}

export interface IUploadRoxFileRequest extends IBaseRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  fieldName: string;
  data: string;
}
export interface IUploadRoxFileReply extends IInstanceReply {
  url: string;
}

export interface IGetArchiveRequest extends IBaseRequest {
  workspaces: string[];
  roxFileIds: number[];
}
export interface IGetArchiveReply extends IInstanceReply {
  instances: IInstanceDetails[];
  instanceUsers: IUserDetails[];
}

export interface IUploadCommentAttachmentRequest extends IBaseRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  data: string;
  trailId: string;
}
export interface IUploadCommentAttachmentReply extends IInstanceReply {
  url: string;
}

export interface ISetFieldContentRequest extends IBaseRequest {
  instanceId: string;
  fieldName: string;
  fieldValue: string;
}
export type ISetFieldContentReply = IInstanceReply;

export interface IDeleteAttachmentRequest extends IBaseRequest {
  processId: string;
  instanceId: string;
  fileName: string;
}
export type IDeleteAttachmentReply = IInstanceReply;

export interface ICommentRequest extends IBaseRequest {
  instanceId: string;
  comment: string;
  trailId: string;
  attachments: string[];
}
export interface IDeleteCommentRequest extends IBaseRequest {
  trailId: string;
}

export interface IDeleteMailRequest extends IBaseRequest {
  trailId: string;
}

export interface IDeleteInstancesRequest extends IBaseRequest {
  instanceIds: string[];
  recursive?: boolean;
}

export const INSTANCELOADED_MESSAGE = "InstanceLoadedMessage";
export interface IInstanceLoadedMessage extends IBaseMessage {
  type: "InstanceLoadedMessage";
  instance?: IInstanceDetails;
}

export interface IExportAuditTrailRequest extends IBaseRequest {
  instanceId: string;
}
export interface IExportAuditTrailReply extends IInstanceReply {
  doc: Buffer;
}

const IGenerateReportRequestTypeOptions = ["docx", "pdf"] as const;

export type IGenerateReportRequestType = (typeof IGenerateReportRequestTypeOptions)[number];

/**
 * Type of the requested report.
 * Defines which input data is provided to the ReportGenerator.
 */
export enum RequestedReportType {
  /**
   * Represents a regular Processes report request
   */
  PROCESSES_REGULAR = 1,
  /**
   * Represents a Processes Statistics report request
   */
  PROCESSES_STATISTICS = 2,
  /**
   * Represents a Risks report request
   */
  RISKS = 3,
  /**
   * Represents a generic module report request without specific additional data
   */
  GENERIC_MODULE = 4,
  /**
   * Represents an Audit report request
   */
  AUDIT = 5,
  /**
   * Represents an Audit Trail report request
   */
  AUDIT_TRAIL = 6,
  /**
   * Represents an Process View report request
   */
  PROCESS_VIEW = 7,
  /**
   * Represents a workspace audit trail report request
   */
  WORKSPACE_AUDIT_TRAIL = 8,
}

/**
 * Helper union type for RequestedInstanceReportType
 */
type RequestedInstanceReportUnionType =
  | RequestedReportType.PROCESSES_REGULAR
  | RequestedReportType.PROCESSES_STATISTICS
  | RequestedReportType.RISKS
  | RequestedReportType.GENERIC_MODULE
  | RequestedReportType.AUDIT
  | RequestedReportType.AUDIT_TRAIL
  | RequestedReportType.PROCESS_VIEW;

interface IGenerateReportForProcessesInstancesCommonData<TYPE extends RequestedReportType> extends IBaseRequest {
  reportType: TYPE;
  instanceIds: string[];
  processId: string;
  draftId: string;
  resultingFileType: IGenerateReportRequestType;
}

/**
 * Represents a Generate Report request for the regular processes instances
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGenerateReportForProcessesInstancesRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.PROCESSES_REGULAR> {
  // Requires no additional data
}

/**
 * Represents a Generate Report request for the processes statistics
 */
interface IGenerateReportForProcessesStatisticsRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.PROCESSES_STATISTICS> {
  statisticsChart: IStatisticsChartDetails;
}

/**
 * Represents a Generate Report request for the regular risks instances
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGenerateReportForRisksRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.RISKS> {
  // Requires no additional data
}

/**
 * Represents a Generate Report request for the regular instances in generic modules
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGenerateReportForGenericModulesRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.GENERIC_MODULE> {
  // Requires no additional data
}

/**
 * Represents a Generate Report request for the regular instances in module Audit
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGenerateReportForAuditInstancesRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.AUDIT> {
  // Requires no additional data
}

/**
 * Represents a Generate Report request for the audit trail
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGenerateReportForAuditTrailRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.AUDIT_TRAIL> {
  // Requires no additional data
}

/**
 * Represents a Generate Report request for the process view
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGenerateReportForProcessViewRequest extends IGenerateReportForProcessesInstancesCommonData<RequestedReportType.PROCESS_VIEW> {
  // Requires no additional data
}

export type IGenerateReportRequest =
  | IGenerateReportForProcessesInstancesRequest
  | IGenerateReportForProcessesStatisticsRequest
  | IGenerateReportForRisksRequest
  | IGenerateReportForGenericModulesRequest
  | IGenerateReportForAuditInstancesRequest
  | IGenerateReportForAuditTrailRequest
  | IGenerateReportForProcessViewRequest;

const IGenerateReportRequestObject: IGenerateReportRequest = {
  reportType: Joi.number()
    .valid(
      RequestedReportType.PROCESSES_REGULAR,
      RequestedReportType.PROCESSES_STATISTICS,
      RequestedReportType.RISKS,
      RequestedReportType.GENERIC_MODULE,
      RequestedReportType.AUDIT,
      RequestedReportType.AUDIT_TRAIL,
      RequestedReportType.PROCESS_VIEW,
    )
    .required() as unknown as RequestedInstanceReportUnionType,
  instanceIds: Joi.array().items(Joi.string()).required() as unknown as string[],
  processId: Joi.string().required() as unknown as string,
  draftId: Joi.string().required() as unknown as string,
  resultingFileType: Joi.string()
    .pattern(createLiteralTypeRegExp(Object.values(IGenerateReportRequestTypeOptions)))
    .required() as unknown as IGenerateReportRequestType,

  // If it is a PROCESSES_STATISTICS request -> Require specific data for this type of request
  statisticsChart: Joi.alternatives().conditional("reportType", {
    is: RequestedReportType.PROCESSES_STATISTICS,
    then: Joi.object(IStatisticsChartObject).allow({}),
    otherwise: Joi.forbidden(),
  }) as unknown as IStatisticsChartDetails,

  // Extends IBaseRequest
  ...IBaseRequestObject,
};

export const IGenerateReportRequestSchema = Joi.object(IGenerateReportRequestObject);

export interface IGenerateReportReply extends IInstanceReply {
  doc: string /* Base64*/;
  fileName: string;
}

const IGenerateReportReplyObject: IGenerateReportReply = {
  doc: Joi.string().allow("").base64().required() as unknown as string,
  fileName: Joi.string().required() as unknown as string,
  // Extends IInstanceReply
  ...IInstanceReplyObject,
};

export const IGenerateReportReplySchema = Joi.object(IGenerateReportReplyObject);

export interface IGetRoxFileLinkReferencesRequest extends IBaseRequest {
  roxFileId: number;
}

const IGetRoxFileLinkReferencesRequestObject: IGetRoxFileLinkReferencesRequest = {
  roxFileId: Joi.number().integer().positive().required() as unknown as number,
  // Extends IBaseRequest
  ...IBaseRequestObject,
};

export const IGetRoxFileLinkReferencesRequestSchema = Joi.object(IGetRoxFileLinkReferencesRequestObject);

export interface IRoxFileLinkReference {
  link: string;
  title: string;
}

const IRoxFileLinkReferenceObject: IRoxFileLinkReference = {
  link: Joi.string().uri().required() as unknown as string,
  title: Joi.string().required() as unknown as string,
};

export const IRoxFileLinkReferenceSchema = Joi.object(IRoxFileLinkReferenceObject);

export interface IGetRoxFileLinkReferencesReply extends IInstanceReply {
  instances: IRoxFileLinkReference[];
}

const IGetRoxFileLinkReferencesReplyObject: IGetRoxFileLinkReferencesReply = {
  instances: Joi.array().items(IRoxFileLinkReferenceSchema).required() as unknown as IRoxFileLinkReference[],
  // Extends .IInstanceReplyObject
  ...IInstanceReplyObject,
};

export const IGetRoxFileLinkReferencesReplySchema = Joi.object(IGetRoxFileLinkReferencesReplyObject);

export interface ISetStartEventReferencesRequest extends IBaseRequest {
  instanceId: string;
  processId: string;
  workspaceId: string;
}

const ISetStartEventReferencesRequestObject: ISetStartEventReferencesRequest = {
  instanceId: Joi.string().required() as unknown as string,
  processId: Joi.string().required() as unknown as string,
  workspaceId: Joi.string().required() as unknown as string,
  // Extends IBaseRequestObject
  ...IBaseRequestObject,
};

export const ISetStartEventReferencesRequestSchema = Joi.object(ISetStartEventReferencesRequestObject);

export interface ICopyFieldsRequest extends IBaseRequest {
  sourceInstanceId: string;
  targetInstanceId: string;
  startEventId: string;
  processId: string;
  workspaceId: string;
}

const ICopyFieldsRequestObject: ICopyFieldsRequest = {
  sourceInstanceId: Joi.string().required() as unknown as string,
  targetInstanceId: Joi.string().required() as unknown as string,
  startEventId: Joi.string().required() as unknown as string,
  processId: Joi.string().required() as unknown as string,
  workspaceId: Joi.string().required() as unknown as string,
  // Extends IBaseRequestObject
  ...IBaseRequestObject,
};

export const ICopyFieldsRequestSchema = Joi.object(ICopyFieldsRequestObject);

export interface ICopyFieldsReply extends IBaseReply {
  fieldContents: IFieldContentMap;
  roleOwners: IRoleOwnerMap;
}

export interface IRightsOwnersRequest extends IBaseRequest {
  // Id of roXtra document to get the rights owners for
  roxFileId: number;
  // The roXtra rights from rights.xml (R0, W1, ...), separated with ,
  rights: string;
}

const IRightsOwnersRequestObject: IRightsOwnersRequest = {
  roxFileId: Joi.number().required() as unknown as number,
  rights: Joi.string().required() as unknown as string,
  ...IBaseRequestObject,
};

export const IRightsOwnersRequestSchema = Joi.object(IRightsOwnersRequestObject);

export interface IRightsOwnersReply extends IBaseReply {
  ownerIds: string[];
}
