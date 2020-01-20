import * as Api from "../legacyapi";
import { rootStore, mergeInstanceToCache } from "../statehandler";
import { Dispatch, Action } from "redux";
import { IInstanceDetails, IResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";
import { IJumpReply, IExecuteReply, ProcessEngineApiRoutes, IUpdateInstanceReply, IAbortReply, INSTANCELOADED_MESSAGE, IInstanceLoadedMessage, IGetInstanceDetailsReply } from "./legacyapi";
import { Instance } from "..";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await rootStore.dispatch<any>(executeInstanceAction(processId, instanceDetails, startEventId, accessToken));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function executeInstanceAction(processId: string, instanceDetails: IInstanceDetails, startEventId?: string, accessToken?: string): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IExecuteReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IExecuteReply> => {
    const response: IExecuteReply = await Api.postJson(ProcessEngineApiRoutes.execute, {
      processId: processId,
      instance: instanceDetails,
      startEventId: startEventId
    }, accessToken);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>({
      type: InstanceActionType.Execute as InstanceActionType,
      processId: processId
    });
    const state = rootStore.getState();
    Object.assign(response, state);

    return response;
  };
}

export async function updateInstance(instance: IInstanceDetails, accessToken: string = null): Promise<IUpdateInstanceReply> {
  const instanceState = rootStore.getState().instanceState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await rootStore.dispatch<any>(updateInstanceAction(instance, instanceState, accessToken));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateInstanceAction(instance: IInstanceDetails, instanceState: Instance.InstanceState, accessToken: string = null): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IUpdateInstanceReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IUpdateInstanceReply> => {
    const response: IUpdateInstanceReply = await Api.postJson(ProcessEngineApiRoutes.updateInstance, {
      instance: instance
    }, accessToken);

    if (response.instance) {
      const { userState, processState } = rootStore.getState();
      response.instance = mergeInstanceToCache(response.instance, instanceState, userState, processState);
    }

    const message: IInstanceLoadedMessage = {
      type: INSTANCELOADED_MESSAGE,
      instance: response.instance
    };
    const state = rootStore.getState();
    Object.assign(message, state);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(message);

    return response;
  };
}

export async function resumeProcess(resumeDetails: IResumeInstanceDetails): Promise<IExecuteReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await rootStore.dispatch<any>(resumeProcessAction(resumeDetails));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resumeProcessAction(resumeDetails: IResumeInstanceDetails): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IExecuteReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IExecuteReply> => {
    const response: IExecuteReply = await Api.postJson(ProcessEngineApiRoutes.resume, {
      resumeDetails: resumeDetails
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>({
      type: InstanceActionType.Resume as InstanceActionType
    });

    const state = rootStore.getState();
    Object.assign(response, state);

    return response;
  };
}

export async function abortInstance(instanceId: string): Promise<IAbortReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await rootStore.dispatch<any>(abortInstanceAction(instanceId));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function abortInstanceAction(instanceId: string): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IAbortReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IAbortReply> => {
    const response: IAbortReply = await Api.postJson(ProcessEngineApiRoutes.abort, {
      instanceId: instanceId
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>({
      type: InstanceActionType.Abort as InstanceActionType
    });

    const state = rootStore.getState();
    Object.assign(response, state);

    return response;
  };
}



export async function jump(instanceId: string, targetBpmnTaskId: string, resumeDetails: IResumeInstanceDetails): Promise<IJumpReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await rootStore.dispatch<any>(jumpAction(instanceId, targetBpmnTaskId, resumeDetails));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jumpAction(instanceId: string, targetBpmnTaskId: string, resumeDetails: IResumeInstanceDetails): <S extends Action<any>>(dispatch: Dispatch<S>) => Promise<IJumpReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <S extends Action<any>>(dispatch: Dispatch<S>): Promise<IJumpReply> => {
    const response: IJumpReply = await Api.postJson(ProcessEngineApiRoutes.jump, {
      instanceId: instanceId,
      targetBpmnTaskId: targetBpmnTaskId,
      resumeDetails: resumeDetails
    });

    const state = rootStore.getState();
    Object.assign(response, state);

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
      const response = {
        type: INSTANCELOADED_MESSAGE,
        instance: cachedInstance
      } as IInstanceLoadedMessage;
      const state = rootStore.getState();
      Object.assign(response, state);
      rootStore.dispatch(response);

      return cachedInstance;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await rootStore.dispatch<any>(loadInstanceAction(instanceId, instanceState, instanceExtras))).instanceDetails;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadInstanceAction(instanceId: string, instanceState: Instance.InstanceState, getExtras: InstanceExtras = InstanceExtras.None): <S extends Action<any>>(dispatch: Dispatch<S>, getState: Function) => Promise<IGetInstanceDetailsReply> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <S extends Action<any>>(dispatch: Dispatch<S>, getState: Function): Promise<IGetInstanceDetailsReply> => {
    const response: IGetInstanceDetailsReply = await Api.getJson(ProcessEngineApiRoutes.getInstanceDetails, {
      instanceId: instanceId,
      getExtras: getExtras
    });
    if (response.instanceDetails) {
      const { userState, processState } = rootStore.getState();
      response.instanceDetails = mergeInstanceToCache(response.instanceDetails, instanceState, userState, processState);
    }

    const message: IInstanceLoadedMessage = {
      type: INSTANCELOADED_MESSAGE,
      instance: response.instanceDetails
    };
    const state = getState();
    Object.assign(message, state);
    Object.assign(response, state);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(message);

    return response;
  };
}
