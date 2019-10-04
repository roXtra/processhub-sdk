import { IBaseReply, IBaseMessage } from "../legacyapi/apiinterfaces";
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
export interface IInstanceRequest {
}
export interface IInstanceReply extends IBaseReply {
  errorMessage?: string;
}

export interface IExecuteRequest extends IInstanceRequest {
  processId: string;
  instance?: IInstanceDetails;
  startEventId?: string;
}
export interface IExecuteReply extends IInstanceReply { // ExecuteReply ist das selbe wie ResumeReply
  instanceId?: string;
}

export interface IUpdateInstanceRequest extends IInstanceRequest {
  instance: IInstanceDetails;
}
export interface IUpdateInstanceReply extends IInstanceReply {
  instance?: IInstanceDetails;
}

export interface IResumeRequest extends IInstanceRequest {
  resumeDetails: IResumeInstanceDetails;
}

export interface IAbortRequest extends IInstanceRequest {
  instanceId: string;
}
export interface IAbortReply extends IInstanceReply {
}

export interface IJumpRequest extends IInstanceRequest {
  instanceId: string;
  targetBpmnTaskId: string;
  resumeDetails: IResumeInstanceDetails;
}
export interface IJumpReply extends IInstanceReply {
}

export interface IGetInstanceDetailsRequest extends IInstanceRequest {
  instanceId: string;
  getExtras: InstanceExtras;
}
export interface IGetInstanceDetailsReply extends IInstanceReply {
  instanceDetails?: IInstanceDetails;
}

export interface IUploadAttachmentRequest extends IInstanceRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  data: string;
}
export interface IUploadAttachmentReply extends IInstanceReply {
  url: string;
}

export interface IUploadRoxFileRequest extends IInstanceRequest {
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

export interface IGetArchiveRequest extends IInstanceRequest {
  workspaces: string[];
  roxFileIds: number[];
}
export interface IGetArchiveReply extends IInstanceReply {
  instances: IInstanceDetails[];
  instanceUsers: UserDetails[];
}

export interface IUploadCommentAttachmentRequest extends IInstanceRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  data: string;
  trailId: string;
}
export interface IUploadCommentAttachmentReply extends IInstanceReply {
  url: string;
}

export interface ISetFieldContentRequest extends IInstanceRequest {
  instanceId: string;
  fieldName: string;
  fieldValue: string;
}
export interface ISetFieldContentReply extends IInstanceReply {
}

export interface IDeleteAttachmentRequest extends IInstanceRequest {
  processId: string;
  instanceId: string;
  fileName: string;
}
export interface IDeleteAttachmentReply extends IInstanceReply {
}

export interface ICommentRequest extends IInstanceRequest {
  instanceId: string;
  comment: string;
  trailId: string;
  attachments: string[];
}
export interface IDeleteCommentRequest extends IInstanceRequest {
  trailId: string;
}

export interface IDeleteMailRequest extends IInstanceRequest {
  trailId: string;
}

export interface IDeleteInstancesRequest extends IInstanceRequest {
  instanceIds: string[];
}

export const INSTANCELOADED_MESSAGE = "InstanceLoadedMessage";
export interface IInstanceLoadedMessage extends IBaseMessage {
  type: "InstanceLoadedMessage";
  instance?: IInstanceDetails;
}

export interface IExportAuditTrailRequest extends IInstanceRequest {
  instanceId: string;
}
export interface IExportAuditTrailReply extends IInstanceReply {
  doc: any;
}

export interface IGenerateReportRequest extends IInstanceRequest {
  instanceIds: string;
  draftId: string;
  type: "docx" | "pdf";
}
export interface IGenerateReportReply extends IInstanceReply {
  doc: any;
  fileName: string;
}