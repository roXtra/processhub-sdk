import { IBaseReply, IBaseMessage, IBaseRequest } from "../legacyapi/apiinterfaces";
import { IInstanceDetails, IResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";
import { UserDetails } from "../user";

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
};

export type ProcessEngineApiRoutes = keyof typeof ProcessEngineApiRoutes;

// API request/reply objects
export interface IInstanceReply extends IBaseReply {
  errorMessage?: string;
}

export interface IExecuteRequest extends IBaseRequest {
  processId: string;
  instance?: IInstanceDetails;
  startEventId?: string;
}
export interface IExecuteReply extends IInstanceReply { // ExecuteReply ist das selbe wie ResumeReply
  instanceId?: string;
}

export interface IUpdateInstanceRequest extends IBaseRequest {
  instance: IInstanceDetails;
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
  processId: string;
  fileName: string;
  data: string;
}
export interface IUploadAttachmentReply extends IInstanceReply {
  url: string;
}

export interface IUploadRoxFileRequest extends IBaseRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  oldFileName: string;
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
  instanceUsers: UserDetails[];
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

export interface IGenerateReportRequest extends IBaseRequest {
  instanceIds: string;
  draftId: string;
  type: "docx" | "pdf";
}
export interface IGenerateReportReply extends IInstanceReply {
  doc: Buffer;
  fileName: string;
}