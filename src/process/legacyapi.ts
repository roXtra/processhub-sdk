import { IBaseMessage, IBaseRequest, IBaseReply, IBaseRequestObject } from "../legacyapi/apiinterfaces";
import { IProcessDetails, ProcessExtras, ProcessResult, ITimerStartEventConfiguration, IServiceDetails } from "./processinterfaces";
import { Bpmn } from "./bpmn";
import { IParseResult } from "bpmn-moddle/lib/simple";
import { IStatisticRow } from "../data/statistics";
import { IFieldDefinition } from "../data/ifielddefinition";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import IQuestionCatalog from "../modules/audits/iquestioncatalog";
import Joi from "joi";
import { StateProcessDetails } from "./processstate";

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
  MoveToArchive: "/api/process/movetoarchive",
  RestoreFromArchive: "/api/process/restorefromarchive",
  UpdateQuestionCatalog: "/api/process/updatequestioncatalog",
  ReplaceUserInProcess: "/api/process/replaceuserinprocess",
  GetAICompletion: "/api/process/getaicompletion",
  GetAIImageCompletion: "/api/process/getaiimagecompletion",
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

export interface IGetProcessDetailsReply<T extends IProcessDetails | StateProcessDetails = IProcessDetails> extends IProcessReply {
  processDetails?: T;
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

export interface IGetAICompletionRequest extends IBaseRequest {
  context: string;
  prompt: string;
}

export interface IGetAICompletionReply extends IBaseReply {
  completion: string;
}

export interface IGetAIImageCompletionReply extends IBaseReply {
  completionImageURL: string;
}

enum ArchiveViewType {
  Default = 0,
  MyOpenRiskAssessments = 1,
}

export interface IBaseStateColumn {
  show: boolean;
  field: string;
  filter: "text" | "numeric" | "boolean" | "date" | "daterange" | undefined;
  filterable?: boolean;
  sortable?: boolean;
  title: string;
  width?: string;
  format?: string;
  /**
   * Should be set to true if a column should not be rendered in the column menu.
   * E.g. columns that only exist for custom grouping
   */
  hidden: boolean;
}

interface IFilterDescriptor {
  field?: string | Function;
  operator: string | Function;
  value?: unknown;
  ignoreCase?: boolean;
}

export interface IArchiveViewDetails {
  viewName: string;
  gridOptions: string;
  publicView: boolean;
  specialViewType?: ArchiveViewType;
  columns: IBaseStateColumn[];
  customFilters?: IFilterDescriptor[];
}

export interface IAddArchiveViewRequest extends IBaseRequest {
  processId: string | undefined;
  publicView: boolean;
  details: IArchiveViewDetails;
}

export interface IDeleteArchiveViewRequest extends IBaseRequest {
  processId: string | undefined;
  viewId: string;
}

export interface IGetArchiveViewsRequest extends IBaseRequest {
  processId: string | undefined;
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
  targetWorkspaceIds: string[];
  displayName: string;
}

export interface ICopyProcessReply extends IBaseReply {
  createdProcesses: IProcessDetails[];
}

export interface IUploadFileRequest extends IBaseRequest {
  processId: string;
  fileName: string;
  data: string;
  reportDraftType: "default" | "statistics";
}

export interface IAddRoXtraFileRequest extends IBaseRequest {
  processId: string;
  fileName: string;
  fileId: number;
  mimeTypeIcon: string | undefined;
}

export interface IUploadReportDraftRequest extends IBaseRequest {
  processId: string;
  fileName: string;
  data: string;
  reportDraftType: "default" | "statistics";
}

export interface IDeleteReportDraftRequest extends IBaseRequest {
  processId: string;
  draftId: string;
  reportDraftType: "default" | "statistics";
}

export interface IDeleteFileRequest extends IBaseRequest {
  processId: string;
  attachmentId: string;
}

export interface IGetProcessStatisticsRequest extends IBaseRequest {
  /**
   * Request statistics for given processId
   */
  processId: string;
  /**
   * Selected timeframe start date in UTC milliseconds
   */
  fromDateUTCMillis?: number;
  /**
   * Selected timeframe end date in UTC milliseconds
   */
  tillDateUTCMillis?: number;
}

export interface IGetProcessStatisticsReply extends IProcessReply {
  statistics: IStatisticRow[];
  runningInstances: { day: Date; instanceIds: string[] }[];
}

export interface ICommentRequest extends IBaseRequest {
  processId: string;
  comment: string;
  trailId: string;
}

export interface IAddCommentReply extends IBaseReply {
  latestCommentAt: Date;
}

export interface IDeleteCommentRequest extends IBaseRequest {
  trailId: string;
}

export const PROCESSLOADED_MESSAGE = "ProcessLoadedMessage";

export interface IProcessLoadedMessage<T extends IProcessDetails | StateProcessDetails> extends IBaseMessage {
  type: "ProcessLoadedMessage";
  processDetails?: T;
  doNotUpdateCurrentProcess?: boolean;
  registerId: string | undefined;
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
  fast?: "true" | "false";
}

export interface IGetProcessInstancesReply extends IBaseMessage {
  instances?: IInstanceDetails[];
}

export interface IMoveToArchiveRequest extends IBaseRequest {
  processId: string;
  message: string;
}

export type IMoveToArchiveReply = IGetProcessDetailsReply;

export interface IRestoreFromArchiveRequest extends IBaseRequest {
  processId: string;
}

export type IRestoreFromArchiveReply = IGetProcessDetailsReply;

export interface IUpdateQuestionCatalogRequest extends IBaseRequest {
  processId: string;
  questionCatalog: IQuestionCatalog;
}

export interface IReplaceUserInProcessRequest extends IBaseRequest {
  processId: string;
  userToReplace: string;
  userThatReplaces: string;
}

const IReplaceUserInProcessRequestObject: IReplaceUserInProcessRequest = {
  processId: Joi.string().required() as unknown as string,
  userToReplace: Joi.string().required() as unknown as string,
  userThatReplaces: Joi.string().required() as unknown as string,
  // Extends IBaseRequestObject
  ...IBaseRequestObject,
};

export const IReplaceUserInProcessRequestSchema = Joi.object(IReplaceUserInProcessRequestObject);
