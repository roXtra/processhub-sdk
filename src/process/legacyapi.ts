import { IBaseMessage, IBaseRequest, IBaseReply } from "../legacyapi/apiinterfaces";
import { IProcessDetails, ProcessExtras, ProcessResult, ITimerStartEventConfiguration, IServiceDetails } from "./processinterfaces";
import { IStatisticRow } from "../data";

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
  GetPublicProcesses: "/api/process/publicprocesses",
  CopyProcess: "/api/process/copyprocess",
  RateProcess: "/api/process/rateprocess",
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
};
export type ProcessRequestRoutes = keyof typeof ProcessRequestRoutes;

// API request/reply objects
export interface IProcessReply extends IBaseMessage {
  errorMessage?: string;
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
export interface ISetTimersOfProcessReply extends IProcessReply {
}

export interface IDownloadProcessRequest extends IBaseRequest {
  processId: string;
}
export interface IDownloadProcessReply extends IProcessReply {
  doc: any;
}

export interface IExportProcessRequest extends IBaseRequest {
  processId: string;
}
export interface IExportProcessReply extends IBaseReply {
  urlName: string;
  bpmn: string;
}

export interface IArchiveViewDetails {
  viewName: string;
  gridOptions: string;
  publicView: boolean;
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

export interface IGetAllServicesRequest extends IBaseRequest {
}
export interface IGetAllServicesReply extends IBaseReply {
  services: IServiceDetails[];
}

export interface IGetPublicProcessesReply extends IProcessReply {
  processes?: IProcessDetails[];
}

export interface IUpdateProcessDetailsRequest extends IBaseRequest {
  processDetails: IProcessDetails;
}

export interface ICopyProcessRequest extends IBaseRequest {
  processId: string;
  targetWorkspaceId: string;
  displayName: string;
}

export interface IRateProcessRequest extends IBaseRequest {
  processId: string;
  ratingDiff: number;
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
  iconLink: string;
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
  bpmnXml: any;
  bpmnContext: any;
}
