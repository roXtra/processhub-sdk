import * as Api from "../legacyapi";
import * as _ from "lodash";
import { rootStore } from "../statehandler";
import { Dispatch, Action, AnyAction } from "redux";
import * as StateHandler from "../statehandler";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { IProcessDetails, ProcessExtras, ITimerStartEventConfiguration } from "./processinterfaces";
import { IGetProcessDetailsReply, ProcessRequestRoutes, PROCESSLOADED_MESSAGE, IProcessLoadedMessage, IGetProcessDetailsRequest, ICopyProcessRequest, IRateProcessRequest, IUploadFileRequest, IDeleteFileRequest, IGetTimersOfProcessReply, ISetTimersOfProcessReply, IGetProcessStatisticsReply, IGetAllServicesReply, IGetAllServicesRequest, IUploadReportDraftRequest, IDeleteReportDraftRequest, IAddRoXtraFileRequest, IGetProcessStatisticsRequest, ISetTimersOfProcessRequest, IGetTimersOfProcessRequest, IUpdateProcessDetailsRequest, IDeleteProcessRequest, ICreateProcessRequest } from "./legacyapi";
import { isTrue } from "../tools/assert";
import { createId } from "../tools/guid";
import { tl } from "../tl";

export const ProcessActionType = {
  Save: "PROCESSACTION_SAVE",
  Changed: "PROCESSACTION_CHANGED",
  CreateInDb: "PROCESSACTION_CREATEINDB",
  CreateInDbDone: "PROCESSACTION_CREATEINDBDONE",
  DeleteFromDb: "PROCESSACTION_DELETEFROMDB",
  DeleteFromDbDone: "PROCESSACTION_DELETEFROMDBDONE",
  GetProcessDetails: "PROCESSACTION_GETPROCESSDETAILS",
  GetProcessTimers: "PROCESSACTION_GETTIMERS",
  SetProcessTimers: "PROCESSACTION_SETTIMERS",
  Update: "PROCESSACTION_UPDATE",
  Failed: "PROCESSACTION_FAILED",
  RateDone: "PROCESSACTION_RATEDONE",
  GetProcessStatistics: "PROCESSACTION_GETPROCESSSTATISTICS",
};
export type ProcessActionType = keyof typeof ProcessActionType;

export interface IProcessAction {
  readonly type: ProcessActionType;
}

export interface IProcessActionFailed extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_FAILED";
  errorMessage: string;
}

export interface IProcessActionGetProcessDetails extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_GETPROCESSDETAILS";
  processId: string;
}

export interface IProcessActionGetTimers extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_GETTIMERS";
  processId: string;
}

export interface IProcessActionDeleteFromDbDone extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_DELETEFROMDBDONE";
}

export interface IProcessActionDeleteFromDb extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_DELETEFROMDB";
  processId: string;
}

export interface IProcessActionCreateInDb extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_CREATEINDB";
  workspaceId: string;
  processId: string;
  processName: string;
  description: string;
}

export interface IProcessActionCreateInDbDone extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_CREATEINDBDONE";
}

export interface IProcessActionUpdate extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_UPDATE";
  xmlStr: string;
}

export interface IProcessActionSave extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_SAVE";
  xmlStr: string;
  bpmnProcess: BpmnProcess;
}

export interface IProcessActionChanged extends IProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_CHANGED";
}

export async function createProcessInDb(processDetails: IProcessDetails, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(createProcessInDbAction(processDetails, accessToken));
}

export function createProcessInDbAction(processDetails: IProcessDetails, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  isTrue(processDetails.workspaceId != null && processDetails.workspaceId != null, "createProcessInDbAction: workspaceId = " + processDetails.workspaceId);
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    dispatch<any>({
      type: ProcessActionType.CreateInDb as ProcessActionType,
      workspaceId: processDetails.workspaceId,
      processId: processDetails.processId,
      description: processDetails.description,
      processName: processDetails.displayName
    });
    const bpmnProcess = processDetails.extras.bpmnProcess;
    processDetails.extras.bpmnProcess = null;
    const response: AnyAction = await Api.postJson(ProcessRequestRoutes.CreateProcess, {
      processDetails: processDetails
    } as ICreateProcessRequest, accessToken);

    response.processState = rootStore.getState().processState;
    response.instanceState = rootStore.getState().instanceState;

    dispatch<any>(response);
    processDetails.extras.bpmnProcess = bpmnProcess;
    return response;
  };
}

export async function deleteProcessFromDb(processId: string, accessToken: string = null): Promise<Api.IBaseMessage> {
  return await rootStore.dispatch<any>(deleteProcessFromDbAction(processId, accessToken));
}

export function deleteProcessFromDbAction(processId: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<Api.IBaseMessage> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<Api.IBaseMessage> => {
    dispatch<any>({
      type: ProcessActionType.DeleteFromDb as ProcessActionType,
      processId: processId,
    });
    const response: Api.IBaseMessage = await Api.postJson(ProcessRequestRoutes.DeleteProcess, {
      processId: processId,
    } as IDeleteProcessRequest, accessToken);
    dispatch<any>(response);
    return response;
  };
}

// MergeProcessToCache cannot run async because it is used from reducers
// completeProcessFromCache also inits bpmnProcess if required
export async function completeProcessFromCache(process: IProcessDetails): Promise<IProcessDetails> {
  if (process == null)
    return null;

  let initBpmn = false;
  if (process.extras.bpmnXml)
    initBpmn = true;

  const { userState, processState, instanceState } = rootStore.getState();
  process = StateHandler.mergeProcessToCache(process, processState, instanceState, userState);

  if (initBpmn) {
    // Also init bpmnProcess
    process.extras.bpmnProcess = new BpmnProcess();
    await process.extras.bpmnProcess.loadXml(process.extras.bpmnXml);
  }

  return process;
}

export async function getAllServices(): Promise<IGetAllServicesReply> {
  return await rootStore.dispatch<any>(getAllServicesAction());
}

export function getAllServicesAction(): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetAllServicesReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetAllServicesReply> => {
    const response: IGetAllServicesReply = await Api.postJson(ProcessRequestRoutes.GetAllServices, {} as IGetAllServicesRequest) as IGetAllServicesReply;
    return response;
  };
}

export async function loadProcess(processId: string, instanceId?: string, getExtras: ProcessExtras = ProcessExtras.ExtrasBpmnXml, forceReload = false, accessToken: string = null): Promise<IProcessDetails> {
  const state = rootStore.getState();
  let cachedProcess = null;

  if (!forceReload && state.processState.processCache)
    cachedProcess = state.processState.processCache[processId];
  if (cachedProcess != null) {
    // Ignore call if all data
    if ((getExtras & ProcessExtras.ExtrasBpmnXml) && cachedProcess.extras.bpmnXml) {
      getExtras -= ProcessExtras.ExtrasBpmnXml;
      if (cachedProcess.extras.bpmnProcess == null) {
        // Special case: Process might be in cache with ExtrasBpmnXml but without bpmnProcess. That can happen when mergeToCache e.g. moves workspace processes to
        // cache. As mergeToCache can only be used sync it cannot init bpmnProcess.
        cachedProcess.extras.bpmnProcess = new BpmnProcess();
        await cachedProcess.extras.bpmnProcess.loadXml(cachedProcess.extras.bpmnXml);
      }
    }
    if ((getExtras & ProcessExtras.ExtrasInstances) && cachedProcess.extras.instances)
      getExtras -= ProcessExtras.ExtrasInstances;
    if ((getExtras & ProcessExtras.ExtrasProcessRolesWithMemberNames) && cachedProcess.extras.processRoles)
      getExtras -= ProcessExtras.ExtrasProcessRolesWithMemberNames;
    if ((getExtras & ProcessExtras.ExtrasSettings) && cachedProcess.extras.settings)
      getExtras -= ProcessExtras.ExtrasSettings;
    if ((getExtras & ProcessExtras.ExtrasAuditTrail) && cachedProcess.extras.auditTrail)
      getExtras -= ProcessExtras.ExtrasAuditTrail;

    if ((getExtras & ProcessExtras.ExtrasSvgString) && (cachedProcess.extras.svgString || cachedProcess.extras.svgString === ""))
      getExtras -= ProcessExtras.ExtrasSvgString;

    if (getExtras === 0) {
      // All data available from cache
      const response = {
        type: PROCESSLOADED_MESSAGE,
        processDetails: cachedProcess
      } as IProcessLoadedMessage;
      Object.assign(response, state);

      rootStore.dispatch(response);

      return cachedProcess;
    }
  }

  return (await rootStore.dispatch<any>(loadProcessAction(processId, instanceId, getExtras, accessToken))).processDetails;
}

export function loadProcessAction(processId: string, instanceId?: string, processExtras?: ProcessExtras, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    const request: IGetProcessDetailsRequest = {
      processId: processId,
      getExtras: processExtras
    };

    if (instanceId != null)
      request.instanceId = instanceId;

    const response: AnyAction = await Api.getJson(ProcessRequestRoutes.GetProcessDetails, request, accessToken);
    if (response.processDetails)
      response.processDetails = await completeProcessFromCache(response.processDetails);

    const state = rootStore.getState();
    Object.assign(response, state);

    dispatch<any>(response);
    return response;
  };
}

export function setLocalProcessXml(xmlStr: string): void {
  const state = rootStore.getState();
  const response = {
    type: ProcessActionType.Save as ProcessActionType,
    xmlStr: xmlStr
  } as IProcessActionSave;
  Object.assign(response, state);

  rootStore.dispatch(response);
}

export async function processChanged(bpmnProcess: BpmnProcess): Promise<void> {
  await rootStore.dispatch<any>(processChangedAction(bpmnProcess));
}

export function processChangedAction(bpmnProcess: BpmnProcess): (dispatch: any) => Promise<void> {
  return async function (dispatch: any): Promise<void> {
    const state = rootStore.getState();
    const processXml = await bpmnProcess.toXmlString();
    let response;
    if (processXml != null) {
      response = {
        type: ProcessActionType.Save as ProcessActionType,
        xmlStr: processXml,
        bpmnProcess: bpmnProcess
      } as IProcessActionSave;
    }
    else {
      response = {
        type: ProcessActionType.Save as ProcessActionType
        // Ohne process ist Aufruf fehlgeschlagen
      } as IProcessActionSave;
    }

    Object.assign(response, state);
    dispatch(response);
  };
}

export async function createNewLocalProcess(workspaceId: string): Promise<IGetProcessDetailsReply> {
  const process: BpmnProcess = new BpmnProcess();
  await process.loadFromTemplate();
  const xml = await process.toXmlString();

  const details: IProcessDetails = {
    processId: createId(),
    workspaceId: workspaceId,
    displayName: tl("Neuer Prozess"),
    description: "",
    useModeler: false, // Neuerstellung per Tabelle
    isNewProcess: true,
    extras: {
      bpmnXml: xml,
      bpmnProcess: process,
      settings: {
        dashboard: {
          cardTitle: "{{ field.Titel }}"
        }
      }
    }
  };
  rootStore.dispatch<IProcessLoadedMessage>({
    type: PROCESSLOADED_MESSAGE,
    processDetails: details
  });

  return {
    type: PROCESSLOADED_MESSAGE,
    result: Api.ApiResult.API_OK,
    processDetails: details
  };
}

export function unloadCurrentProcess(): void {
  rootStore.dispatch<IProcessLoadedMessage>({
    type: PROCESSLOADED_MESSAGE,
    processDetails: null
  });
}

export async function updateProcess(processDetails: IProcessDetails, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  // Siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch<any>(updateProcessAction(processDetails, accessToken));
}

export function updateProcessAction(process: IProcessDetails, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    dispatch<any>({
      type: ProcessActionType.GetProcessDetails as ProcessActionType
    } as IProcessActionGetProcessDetails);

    // BpmnProcess cannot be serialized
    process.extras.bpmnProcess = null;
    const requestDetails = _.clone(process);
    requestDetails.extras.instances = undefined;
    requestDetails.extras.auditTrail = undefined;

    const response: AnyAction = await Api.postJson(ProcessRequestRoutes.UpdateProcess, {
      processDetails: requestDetails
    } as IUpdateProcessDetailsRequest, accessToken);

    // Update extras svg string from local change
    if (response.processDetails.extras.svgString == null && process.extras.svgString != null) {
      response.processDetails.extras.svgString = process.extras.svgString;
    }

    response.processDetails = await completeProcessFromCache(response.processDetails);
    const state = rootStore.getState();
    Object.assign(response, state);

    dispatch<any>(response);
    return response;
  };
}

export async function copyProcess(processId: string, targetWorkspaceId: string, displayName: string, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(copyProcessAction(processId, targetWorkspaceId, displayName, accessToken));
}

export function copyProcessAction(processId: string, targetWorkspaceId: string, displayName: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    dispatch<any>({
      type: ProcessActionType.GetProcessDetails as ProcessActionType
    } as IProcessActionGetProcessDetails);
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.CopyProcess,
      { processId, targetWorkspaceId, displayName } as ICopyProcessRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}

export async function rateProcess(processId: string, ratingDiff: number, accessToken: string = null): Promise<Api.IBaseReply> {
  return await rootStore.dispatch<any>(rateProcessAction(processId, ratingDiff, accessToken));
}

export function rateProcessAction(processId: string, ratingDiff: number, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<Api.IBaseReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<Api.IBaseReply> => {
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.RateProcess,
      { processId, ratingDiff } as IRateProcessRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}

export async function addRoXtraFile(processId: string, fileName: string, fileId: number, iconLink: string, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(addRoXtraFileAction(processId, fileName, fileId, iconLink, accessToken));
}

export function addRoXtraFileAction(processId: string, fileName: string, fileId: number, iconLink: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  const request: IAddRoXtraFileRequest = {
    processId,
    fileId,
    fileName,
    iconLink,
  };
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.AddRoXtraFile,
      request,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}

export async function uploadFile(processId: string, fileName: string, data: string, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(uploadFileAction(processId, fileName, data, accessToken));
}

export function uploadFileAction(processId: string, fileName: string, data: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.UploadFile,
      { processId, fileName, data } as IUploadFileRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}


export async function uploadReportDraft(processId: string, fileName: string, data: string, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(uploadReportDraftAction(processId, fileName, data, accessToken));
}

export function uploadReportDraftAction(processId: string, fileName: string, data: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.UploadReportDraft,
      { processId, fileName, data } as IUploadReportDraftRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}

export async function deleteReportDraft(processId: string, draftId: string, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(deleteReportDraftAction(processId, draftId, accessToken));
}

export function deleteReportDraftAction(processId: string, draftId: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.DeleteReportDraft,
      { processId, draftId } as IDeleteReportDraftRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}

export async function deleteFile(processId: string, attachmentId: string, accessToken: string = null): Promise<IGetProcessDetailsReply> {
  return await rootStore.dispatch<any>(deleteFileAction(processId, attachmentId, accessToken));
}

export function deleteFileAction(processId: string, attachmentId: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessDetailsReply> => {
    const response: IGetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.DeleteFile,
      { processId, attachmentId } as IDeleteFileRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch<any>(response);
    return response;
  };
}

export async function getTimersOfProcess(processId: string, accessToken: string = null): Promise<IGetTimersOfProcessReply> {
  // Siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch<any>(getTimersOfProcessAction(processId, accessToken));
}

export function getTimersOfProcessAction(processId: string, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetTimersOfProcessReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetTimersOfProcessReply> => {
    const response: IGetTimersOfProcessReply = await Api.postJson(ProcessRequestRoutes.GetTimers, {
      processId: processId
    } as IGetTimersOfProcessRequest, accessToken);

    dispatch<any>(response);
    return response;
  };
}
export async function setTimersOfProcess(processId: string, timers: ITimerStartEventConfiguration[], accessToken: string = null): Promise<ISetTimersOfProcessReply> {
  // Siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch<any>(setTimersOfProcessAction(processId, timers, accessToken));
}

export function setTimersOfProcessAction(processId: string, timers: ITimerStartEventConfiguration[], accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<ISetTimersOfProcessReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<ISetTimersOfProcessReply> => {
    const response: ISetTimersOfProcessReply = await Api.postJson(ProcessRequestRoutes.SetTimers, {
      processId: processId,
      timers: timers
    } as ISetTimersOfProcessRequest, accessToken);

    dispatch<any>(response);
    return response;
  };
}

export async function getProcessStatistics(processId: string, fromDate: Date = null, tillDate: Date = null, accessToken: string = null): Promise<IGetProcessStatisticsReply> {
  // Siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch<any>(getProcessStatisticsAction(processId, fromDate, tillDate, accessToken));
}

export function getProcessStatisticsAction(processId: string, fromDate: Date, tillDate: Date, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetProcessStatisticsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetProcessStatisticsReply> => {
    const response: IGetProcessStatisticsReply = await Api.postJson(ProcessRequestRoutes.GetProcessStatistics, {
      processId: processId,
      fromDate: fromDate,
      tillDate: tillDate
    } as IGetProcessStatisticsRequest, accessToken) as IGetProcessStatisticsReply;

    dispatch<any>(response);
    return response;
  };
}