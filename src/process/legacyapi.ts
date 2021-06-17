import { IBaseMessage, IBaseRequest, IBaseReply } from "../legacyapi/apiinterfaces";
import { IProcessDetails, ProcessExtras, ProcessResult, ITimerStartEventConfiguration, IServiceDetails } from "./processinterfaces";
import { IFieldDefinition } from "../data";
import { Bpmn } from "./bpmn";
import { IParseResult } from "bpmn-moddle/lib/simple";
import { Instance } from "..";
import { IStatisticRow } from "../data/statistics";

// API routes
export const ProcessRequestRoutes = {
  CreateProcess: "/api/process/createprocess",
  DeleteProcess: "/api/process/deleteprocess",
  GetProcessDetails: "/api/process/processdetails",
  GetProcessDetailsFromUrl: "/api/process/processfromurl",
  UpdateProcess: "/api/process/updateprocess",
  GetTimers: "/api/process/gettimers",
  SetTimers: "/api/process/settimers",
  DownloadProcess: "/api/process/download",
  ExportProcess: "/api/process/export",
  CopyProcess: "/api/process/copyprocess",
  UploadFile: "/api/process/uploadfile",
  AddRoXtraFile: "/api/process/addroxtrafile",
  DeleteFile: "/api/process/deletefile",
  GetProcessStatistics: "/api/process/getstatistics",
  Comment: "/api/process/comment",
  DeleteComment: "/api/process/deletecomment",
  GetAllServices: "/api/process/getallservices",
  AddArchiveView: "/api/process/addarchiveview",
  GetArchiveViews: "/api/process/getarchiveviews",
  DeleteArchiveView: "/api/process/deletearchiveview",
  UploadReportDraft: "/api/process/uploadreportdraft",
  DeleteReportDraft: "/api/process/deletereportdraft",
  ListProcesses: "/api/process/listprocesses",
  TemplateProcesses: "/api/process/templateprocesses",
  TemplateCustomProcesses: "/api/process/templatecustomprocesses",
  UpdateFieldDefinition: "/api/process/updatefielddefinition",
  GetProcessInstances: "/api/process/getprocessinstances",
};
export type ProcessRequestRoutes = keyof typeof ProcessRequestRoutes;

export interface IUpdateFieldDefinitionRequest extends IBaseRequest {
  processId: string;
  bpmnElementId: string | undefined;
  fieldDefinition: IFieldDefinition;
}

// API request/reply objects
export interface IProcessReply extends IBaseMessage {
  errorMessage?: string;
}

export interface ITemplateProcessesReply extends IBaseReply {
  templates: { config: string; xml: string; metaData: { shortDescription: string; description: string } }[];
}

export interface ICreateProcessRequest extends IBaseRequest {
  processDetails: IProcessDetails;
}

export interface IDeleteProcessRequest extends IBaseRequest {
  processId: string;
}

export interface IGetProcessDetailsRequest extends IBaseRequest {
  processId: string;
  instanceId?: string;
  getExtras?: ProcessExtras;
}

export interface IGetProcessDetailsFromUrlRequest extends IBaseRequest {
  processUrl: string;
}

export interface IGetProcessDetailsReply extends IProcessReply {
  processDetails?: IProcessDetails;
}

export interface IGetTimersOfProcessRequest extends IBaseRequest {
  processId: string;
}

export interface IGetTimersOfProcessReply extends IProcessReply {
  timers?: ITimerStartEventConfiguration[];
}

export interface ISetTimersOfProcessRequest extends IBaseRequest {
  processId: string;
  timers: ITimerStartEventConfiguration[];
}

export type ISetTimersOfProcessReply = IProcessReply;

export interface IDownloadProcessRequest extends IBaseRequest {
  processId: string;
}

export interface IDownloadProcessReply extends IProcessReply {
  doc: Buffer;
}

export interface IExportProcessRequest extends IBaseRequest {
  processId: string;
}

export interface IExportProcessReply extends IBaseReply {
  urlName: string;
  bpmn: string;
}

enum ArchiveViewType {
  Default = 0,
  MyOpenRiskAssessments = 1,
}

export interface IArchiveViewDetails {
  viewName: string;
  gridOptions: string;
  publicView: boolean;
  specialViewType?: ArchiveViewType;
}

export interface IAddArchiveViewRequest extends IBaseRequest {
  processId: string;
  publicView: boolean;
  details: IArchiveViewDetails;
}

export interface IDeleteArchiveViewRequest extends IBaseRequest {
  processId: string;
  viewId: string;
}

export interface IGetArchiveViewsRequest extends IBaseRequest {
  processId: string;
}

export interface IGetArchiveViewsReply extends IBaseReply {
  views: { [viewId: string]: IArchiveViewDetails };
}

export type IGetAllServicesRequest = IBaseRequest;

export interface IGetAllServicesReply extends IBaseReply {
  services: IServiceDetails[];
}

export interface IUpdateProcessDetailsRequest extends IBaseRequest {
  processDetails: IProcessDetails;
}

export interface ICopyProcessRequest extends IBaseRequest {
  processId: string;
  targetWorkspaceId: string;
  displayName: string;
}

export interface IUploadFileRequest extends IBaseRequest {
  processId: string;
  fileName: string;
  data: string;
}

export interface IAddRoXtraFileRequest extends IBaseRequest {
  processId: string;
  fileName: string;
  fileId: number;
  iconLink: string | undefined;
}

export interface IUploadReportDraftRequest extends IBaseRequest {
  processId: string;
  fileName: string;
  data: string;
}

export interface IDeleteReportDraftRequest extends IBaseRequest {
  processId: string;
  draftId: string;
}

export interface IDeleteFileRequest extends IBaseRequest {
  processId: string;
  attachmentId: string;
}

export interface IGetProcessStatisticsRequest extends IBaseRequest {
  processId: string;
  fromDate?: Date;
  tillDate?: Date;
}

export interface IGetProcessStatisticsReply extends IProcessReply {
  statistics: IStatisticRow[];
}

export interface ICommentRequest extends IBaseRequest {
  processId: string;
  comment: string;
  trailId: string;
}

export interface IDeleteCommentRequest extends IBaseRequest {
  trailId: string;
}

export const PROCESSLOADED_MESSAGE = "ProcessLoadedMessage";

export interface IProcessLoadedMessage extends IBaseMessage {
  type: "ProcessLoadedMessage";
  processDetails?: IProcessDetails;
}

export interface ILoadTemplateReply {
  result: ProcessResult;
  bpmnXml: Bpmn.IDefinitions;
  bpmnContext: IParseResult;
}

export interface IListProcessesReply extends IBaseReply {
  processes: {
    moduleId: number;
    displayName: string;
    processId: string;
    workspaceId: string;
    workspaceDisplayName: string;
  }[];
}

export interface IGetProcessInstancesRequest extends IBaseRequest {
  processId: string;
  // The fast option speeds up the call but the resulting instances have less information (eg. field contents are not included)
  fast?: boolean;
}

export interface IGetProcessInstancesReply extends IBaseMessage {
  instances?: Instance.IInstanceDetails[];
}
