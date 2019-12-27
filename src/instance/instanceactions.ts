import * as Api from "../legacyapi";
import { rootStore, mergeInstanceToCache } from "../statehandler";
import { Dispatch, Action } from "redux";
import { IInstanceDetails, IResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";
import { IJumpReply, IExecuteReply, ProcessEngineApiRoutes, IUpdateInstanceReply, IAbortReply, INSTANCELOADED_MESSAGE, IInstanceLoadedMessage, IGetInstanceDetailsReply } from "./legacyapi";

export const InstanceActionType = {
  Execute: "INSTANCEACTION_EXECUTE",
  Resume: "INSTANCEACTION_RESUME",
  Abort: "INSTANCEACTION_ABORT",
  Jump: "INSTANCEACTION_JUMP",
  GetInstanceDetails: "INSTANCEACTION_GETINSTANCEDETAILS",
  UpdateInstance: "INSTANCEACTION_UPDATEINSTANCE"
};
export type InstanceActionType = keyof typeof InstanceActionType;

export interface IInstanceAction {
  readonly type: InstanceActionType;
}

export interface IInstanceActionExecute extends IInstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_EXECUTE";
  processId: string;
}

export interface IInstanceActionUpdateInstance extends IInstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_EXECUTE";
}

export interface IInstanceActionResume extends IInstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_RESUME";
}

export interface IInstanceActionAbort extends IInstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_ABORT";
}

export interface IInstanceActionJump extends IInstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_JUMP";
}

export async function executeInstance(processId: string, instanceDetails: IInstanceDetails, startEventId?: string, accessToken?: string): Promise<IExecuteReply> {
  return await rootStore.dispatch<any>(executeInstanceAction(processId, instanceDetails, startEventId, accessToken));
}

export function executeInstanceAction(processId: string, instanceDetails: IInstanceDetails, startEventId?: string, accessToken?: string): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IExecuteReply> {

  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IExecuteReply> => {
    const response: IExecuteReply = await Api.postJson(ProcessEngineApiRoutes.execute, {
      processId: processId,
      instance: instanceDetails,
      startEventId: startEventId
    }, accessToken);

    dispatch<any>({
      type: InstanceActionType.Execute as InstanceActionType,
      processId: processId
    });
    return response;
  };
}

export async function updateInstance(instance: IInstanceDetails, accessToken: string = null): Promise<IUpdateInstanceReply> {
  return await rootStore.dispatch<any>(updateInstanceAction(instance, accessToken));
}

export function updateInstanceAction(instance: IInstanceDetails, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IUpdateInstanceReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IUpdateInstanceReply> => {
    const response: IUpdateInstanceReply = await Api.postJson(ProcessEngineApiRoutes.updateInstance, {
      instance: instance
    }, accessToken);

    if (response.instance)
      response.instance = mergeInstanceToCache(response.instance);

    const message: IInstanceLoadedMessage = {
      type: INSTANCELOADED_MESSAGE,
      instance: response.instance
    };
    dispatch<any>(message);

    return response;
  };
}

export async function resumeProcess(resumeDetails: IResumeInstanceDetails): Promise<IExecuteReply> {
  return await rootStore.dispatch<any>(resumeProcessAction(resumeDetails));
}

export function resumeProcessAction(resumeDetails: IResumeInstanceDetails): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IExecuteReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IExecuteReply> => {
    const response: IExecuteReply = await Api.postJson(ProcessEngineApiRoutes.resume, {
      resumeDetails: resumeDetails
    });

    dispatch<any>({
      type: InstanceActionType.Resume as InstanceActionType
    });
    return response;
  };
}

export async function abortInstance(instanceId: string): Promise<IAbortReply> {
  return await rootStore.dispatch<any>(abortInstanceAction(instanceId));
}

export function abortInstanceAction(instanceId: string): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IAbortReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IAbortReply> => {
    const response: IAbortReply = await Api.postJson(ProcessEngineApiRoutes.abort, {
      instanceId: instanceId
    });

    dispatch<any>({
      type: InstanceActionType.Abort as InstanceActionType
    });
    return response;
  };
}



export async function jump(instanceId: string, targetBpmnTaskId: string, resumeDetails: IResumeInstanceDetails): Promise<IJumpReply> {
  return await rootStore.dispatch<any>(jumpAction(instanceId, targetBpmnTaskId, resumeDetails));
}

export function jumpAction(instanceId: string, targetBpmnTaskId: string, resumeDetails: IResumeInstanceDetails): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IJumpReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IJumpReply> => {
    const response: IJumpReply = await Api.postJson(ProcessEngineApiRoutes.jump, {
      instanceId: instanceId,
      targetBpmnTaskId: targetBpmnTaskId,
      resumeDetails: resumeDetails
    });

    dispatch<any>({
      type: InstanceActionType.Jump as InstanceActionType
    });
    return response;
  };
}

export async function loadInstance(instanceId: string, instanceExtras?: InstanceExtras, forceReload = false): Promise<IInstanceDetails> {
  const instanceState = rootStore.getState().instanceState;
  let cachedInstance = null;

  if (!forceReload && instanceState.instanceCache)
    cachedInstance = instanceState.instanceCache[instanceId];
  if (cachedInstance != null) {
    // Ignore call if all data
    // PH.Instance.InstanceExtras.ExtrasState is server-only
    if ((instanceExtras & InstanceExtras.ExtrasFieldContents) && cachedInstance.extras.fieldContents)
      instanceExtras -= InstanceExtras.ExtrasFieldContents;
    if ((instanceExtras & InstanceExtras.ExtrasRoleOwners) && cachedInstance.extras.roleOwners)
      instanceExtras -= InstanceExtras.ExtrasRoleOwners;
    if ((instanceExtras & InstanceExtras.ExtrasAuditTrail) && cachedInstance.extras.auditTrail)
      instanceExtras -= InstanceExtras.ExtrasAuditTrail;
    if ((instanceExtras & InstanceExtras.ExtrasTodos) && cachedInstance.extras.todos)
      instanceExtras -= InstanceExtras.ExtrasTodos;
    if ((instanceExtras & InstanceExtras.ExtrasRoleOwnersWithNames) && cachedInstance.extras.roleOwners) {
      // Names available?
      for (const roleId in cachedInstance.extras.roleOwners) {
        const roleowners = cachedInstance.extras.roleOwners[roleId];
        for (const roleowner of roleowners) {
          if (roleowner.displayName != null) {
            if (instanceExtras & InstanceExtras.ExtrasRoleOwnersWithNames)
              instanceExtras -= InstanceExtras.ExtrasRoleOwnersWithNames;
            break;
          }
        }
      }
    }

    if (instanceExtras === 0) {
      // All data available from cache
      rootStore.dispatch({
        type: INSTANCELOADED_MESSAGE,
        instance: cachedInstance
      } as IInstanceLoadedMessage);

      return cachedInstance;
    }
  }

  return (await rootStore.dispatch<any>(loadInstanceAction(instanceId, instanceExtras))).instanceDetails;
}
export function loadInstanceAction(instanceId: string, getExtras: InstanceExtras = InstanceExtras.None): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IGetInstanceDetailsReply> {
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IGetInstanceDetailsReply> => {
    const response: IGetInstanceDetailsReply = await Api.getJson(ProcessEngineApiRoutes.getInstanceDetails, {
      instanceId: instanceId,
      getExtras: getExtras
    });
    if (response.instanceDetails)
      response.instanceDetails = mergeInstanceToCache(response.instanceDetails);

    const message: IInstanceLoadedMessage = {
      type: INSTANCELOADED_MESSAGE,
      instance: response.instanceDetails
    };
    dispatch<any>(message);

    return response;
  };
}
