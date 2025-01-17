import { IFieldValue } from "../data/ifieldvalue.js";
import { IQuestion } from "../modules/audits/iquestioncatalog.js";
import { IAuditTrailEntryDetails, AuditTrailAction, IBaseAuditTrailEntry } from "./audittrailinterfaces.js";

export interface IAuditTrailEntryInstance extends IBaseAuditTrailEntry {
  instanceId: string;
  processId: string;
  workspaceId: string;
}

export interface IAuditTrailEntryIncomingMailV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    mailSubject: string;
    mailText: string;
    mailAttachments: string[];
    from: string;
  };
  action: AuditTrailAction.incomingMailV2;
}

export interface IAuditTrailEntryJumpPerformedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    // Values for from are undefinded if the instance was reactivated
    from: { displayName: string | undefined; bpmnTaskId: string | undefined };
    to: { displayName: string; bpmnTaskId: string };
  };
  action: AuditTrailAction.jumpPerformedV2;
}

export interface IAuditTrailEntryInstanceCommentV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    comment: string;
    commentAttachments: string[];
  };
  action: AuditTrailAction.instanceCommentV2;
}

export interface IAuditTrailEntryOutgoingMailV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    mailSubject: string;
    mailReceiverList: string[];
    mailText: string;
    mailAttachments: string[];
  };
  action: AuditTrailAction.outgoingMailV2;
}

export interface IAuditTrailEntryErrorSubprocessV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    errorCode: string | undefined;
    subprocessName: string | undefined;
    bpmnTaskId: string;
  };
  action: AuditTrailAction.errorSubprocessV2;
}

export interface IAuditTrailEntryErrorOnEvaluateGatewayDecisionV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    gatewayName: string | undefined;
    gatewayId: string;
  };
  action: AuditTrailAction.errorOnEvaluateGatewayDecisionV2;
}

export interface IAuditTrailEntryInstanceStateErrorV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {};
  action: AuditTrailAction.instanceStateErrorV2;
}

export interface IAuditTrailEntryErrorSubProcessMappingV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    errorMessage: string;
    bpmnTaskId: string;
    subProcessName: string | undefined;
  };
  action: AuditTrailAction.errorSubProcessMappingV2;
}

export interface IAuditTrailEntryIntermediateTimerTriggeredManuallyV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    bpmnTaskId: string;
    todoDisplayName: string;
  };
  action: AuditTrailAction.intermediateTimerTriggeredManuallyV2;
}

export interface IAuditTrailEntryLinkedInstanceDeletedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    oldValue: {
      title: string;
      instanceId: string;
      processId: string;
    };
  };
  action: AuditTrailAction.linkedInstanceDeletedV2;
}

export interface IAuditTrailEntryFieldTypeChangedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    oldValue: IFieldValue | undefined;
    newValue: IFieldValue | undefined;
    fieldName: string;
  };
  action: AuditTrailAction.fieldTypeChangedV2;
}

export interface IAuditTrailEntrySignalBoundaryEventTriggeredV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string;
    completedTaskBpmnId: string;
    boundaryEventBpmnId: string;
    boundaryEventName: string;
  };
  action: AuditTrailAction.signalBoundaryEventTriggeredV2;
}

export interface IAuditTrailEntryTimerBoundaryEventTriggeredV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string;
    completedTaskBpmnId: string;
    boundaryEventBpmnId: string;
    boundaryEventName: string;
  };
  action: AuditTrailAction.timerBoundaryEventTriggeredV2;
}

export interface IAuditTrailEntryMessageBoundaryEventTriggeredV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string;
    completedTaskBpmnId: string;
    boundaryEventBpmnId: string;
    boundaryEventName: string;
  };
  action: AuditTrailAction.messageBoundaryEventTriggeredV2;
}

export interface IAuditTrailEntryDecisionV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string;
    completedTaskBpmnId: string;
    choosenTaskName: string;
    choosenTaskBpmnId: string;
  };
  action: AuditTrailAction.decisionV2;
}

export interface IAuditTrailEntryErrorInServiceTaskV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    errorCode: string | undefined;
    errorMessage: string | undefined;
    todoDisplayName: string | undefined;
    bpmnTaskId: string;
  };
  action: AuditTrailAction.errorInServiceTaskV2;
}

export interface IAuditTrailEntryErrorInScriptTaskV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    errorCode: string | undefined;
    errorMessage: string | undefined;
    todoDisplayName: string | undefined;
    bpmnTaskId: string;
  };
  action: AuditTrailAction.errorInScriptTaskV2;
}

export interface IAuditTrailEntryInstanceCanceledV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {};
  action: AuditTrailAction.instanceCanceledV2;
}

export interface IAuditTrailEntrySetFieldForParentInstanceV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    fieldName: string;
    newValue: IFieldValue | undefined;
    parentInstanceId: string;
  };
  action: AuditTrailAction.setFieldForParentInstanceV2;
}

export interface IAuditTrailEntrySetFieldForSubInstanceV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    fieldName: string;
    newValue: IFieldValue | undefined;
    subInstanceId: string;
  };
  action: AuditTrailAction.setFieldForSubInstanceV2;
}

export interface IAuditTrailEntryDataReceivedFromSubInstance extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    subInstanceId: string;
    providedFields: { fieldName: string; value: IFieldValue }[];
  };
  action: AuditTrailAction.dataReceivedFromSubInstance;
}

export interface IAuditTrailEntryDataReceivedFromParentInstance extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    parentInstanceId: string;
    providedFields: { fieldName: string; value: IFieldValue }[];
  };
  action: AuditTrailAction.dataReceivedFromParentInstance;
}

export interface IAuditTrailEntrySendTaskV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string;
    htmlMailContent: string;
    mailReceiverList: string[];
    mailSubject: string;
  };
  action: AuditTrailAction.sendTaskV2;
}

export interface IAuditTrailEntrySubInstanceDeleted extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    subInstanceId: string;
  };
  action: AuditTrailAction.subInstanceDeleted;
}

export interface IAuditTrailEntryEndEventV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    eventId: string;
    eventName: string | undefined;
  };
  action: AuditTrailAction.endEventV2;
}

export interface IAuditTrailEntryStartEventV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    eventId: string;
    eventName: string | undefined;
    startEventType: "TimerStartEvent" | "MessageStartEvent" | "StartEvent";
    processBpmnVersion: number;
  };
  action: AuditTrailAction.startEventV2;
}

export interface IAuditTrailEntryFieldContentChangedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    fieldName: string;
    oldValue: IFieldValue | undefined;
    newValue: IFieldValue | undefined;
  };
  action: AuditTrailAction.fieldContentChangedV2;
}

export interface IAuditTrailEntryTodoDueAtDateChangedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string;
    bpmnTaskId: string;
    oldValue: Date | undefined;
    newValue: Date | undefined;
  };
  action: AuditTrailAction.todoDueAtDateChangedV2;
}

export interface IAuditTrailEntryInstanceRoleChangedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    roleName: string;
    roleId: string; // Lane id or default role id (eg FOLLOWER)
    oldValue: { id: string; displayName: string }[];
    newValue: { id: string; displayName: string }[];
  };
  action: AuditTrailAction.instanceRoleChangedV2;
}

export interface IAuditTrailEntryAuditQuestionDeletedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    oldValue: {
      questionId: string;
      questionText: string;
    };
    fieldName: string;
  };
  action: AuditTrailAction.auditQuestionDeletedV2;
}

export interface IAuditTrailEntryAuditQuestionContentChangedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    oldValue: Partial<IQuestion>;
    newValue: Partial<IQuestion>;
    fieldName: string;
  };
  action: AuditTrailAction.auditQuestionContentChangedV2;
}

export interface IAuditTrailEntryAuditQuestionTextChangedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    oldValue: string;
    newValue: string;
    questionId: string;
    fieldName: string;
  };
  action: AuditTrailAction.auditQuestionTextChangedV2;
}

export interface IAuditTrailEntryAuditQuestionAddedV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    newValue: IQuestion;
    fieldName: string;
  };
  action: AuditTrailAction.auditQuestionAddedV2;
}

export interface IAuditTrailEntryErrorInSendTaskV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    errorCode: string | undefined;
    errorMessage: string | undefined;
    todoDisplayName: string | undefined;
    bpmnTaskId: string;
  };
  action: AuditTrailAction.errorInSendTaskV2;
}

export interface IAuditTrailEntryInstanceUpdatedOfflineModeV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {};
  action: AuditTrailAction.instanceUpdatedOfflineModeV2;
}

export interface IAuditTrailEntryCompletedTodoV2 extends IAuditTrailEntryInstance {
  details: IAuditTrailEntryDetails & {
    todoDisplayName: string | undefined;
    bpmnTaskId: string;
    flowName?: string;
  };
  action: AuditTrailAction.completedTodoV2;
}
