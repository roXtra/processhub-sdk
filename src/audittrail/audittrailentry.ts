import { ILegacyAuditTrailEntry } from "./audittrailinterfaces.js";
import {
  IAuditTrailEntryCompletedTodoV2,
  IAuditTrailEntryErrorInSendTaskV2,
  IAuditTrailEntryInstanceUpdatedOfflineModeV2,
  IAuditTrailEntryAuditQuestionDeletedV2,
  IAuditTrailEntryAuditQuestionContentChangedV2,
  IAuditTrailEntryAuditQuestionTextChangedV2,
  IAuditTrailEntryAuditQuestionAddedV2,
  IAuditTrailEntryInstanceStateErrorV2,
  IAuditTrailEntryErrorSubProcessMappingV2,
  IAuditTrailEntryIntermediateTimerTriggeredManuallyV2,
  IAuditTrailEntryLinkedInstanceDeletedV2,
  IAuditTrailEntryFieldTypeChangedV2,
  IAuditTrailEntrySignalBoundaryEventTriggeredV2,
  IAuditTrailEntryTimerBoundaryEventTriggeredV2,
  IAuditTrailEntryErrorInServiceTaskV2,
  IAuditTrailEntryErrorInScriptTaskV2,
  IAuditTrailEntryInstanceCanceledV2,
  IAuditTrailEntryDecisionV2,
  IAuditTrailEntrySetFieldForParentInstanceV2,
  IAuditTrailEntrySubInstanceDeleted,
  IAuditTrailEntrySendTaskV2,
  IAuditTrailEntryEndEventV2,
  IAuditTrailEntryStartEventV2,
  IAuditTrailEntryFieldContentChangedV2,
  IAuditTrailEntryTodoDueAtDateChangedV2,
  IAuditTrailEntryInstanceRoleChangedV2,
  IAuditTrailEntryErrorOnEvaluateGatewayDecisionV2,
  IAuditTrailEntryErrorSubprocessV2,
  IAuditTrailEntryMessageBoundaryEventTriggeredV2,
  IAuditTrailEntryOutgoingMailV2,
  IAuditTrailEntryIncomingMailV2,
  IAuditTrailEntryJumpPerformedV2,
  IAuditTrailEntryInstanceCommentV2,
  IAuditTrailEntrySetFieldForSubInstanceV2,
  IAuditTrailEntryDataReceivedFromSubInstance,
  IAuditTrailEntryDataReceivedFromParentInstance,
} from "./instanceentries.js";
import {
  IAuditTrailEntryAuditTrailVisibilityChangedV2,
  IAuditTrailEntryAutomatedInstanceDeletionV2,
  IAuditTrailEntryDeletionPeriodChangedV2,
  IAuditTrailEntryInstanceDeletedV2,
  IAuditTrailEntryProcessArchivedV2,
  IAuditTrailEntryProcessCommentV2,
  IAuditTrailEntryProcessCreatedV2,
  IAuditTrailEntryProcessDeletedV2,
  IAuditTrailEntryProcessDescriptionChangedV2,
  IAuditTrailEntryProcessDisplayNameChangedV2,
  IAuditTrailEntryProcessEditedV2,
  IAuditTrailEntryProcessRestoredV2,
  IAuditTrailEntryProcessRolesChangedV2,
  IAuditTrailEntryProcessTagsChangedV2,
  IAuditTrailEntryProcessVisibilityChangedV2,
  IAuditTrailEntryProcessXmlChangedByInlineSettingsV2,
  IAuditTrailEntryProcessXmlChangedV2,
  IAuditTrailEntryReplaceUserV2,
  IAuditTrailEntryRetentionPeriodChangedV2,
  IAuditTrailEntryRetentionPeriodLockChangedV2,
} from "./processentries.js";

export type AuditTrailEntry =
  | ILegacyAuditTrailEntry
  | IAuditTrailEntryCompletedTodoV2
  | IAuditTrailEntryRetentionPeriodLockChangedV2
  | IAuditTrailEntryErrorInSendTaskV2
  | IAuditTrailEntryInstanceUpdatedOfflineModeV2
  | IAuditTrailEntryReplaceUserV2
  | IAuditTrailEntryAuditTrailVisibilityChangedV2
  | IAuditTrailEntryAuditQuestionDeletedV2
  | IAuditTrailEntryAuditQuestionContentChangedV2
  | IAuditTrailEntryAuditQuestionTextChangedV2
  | IAuditTrailEntryAuditQuestionAddedV2
  | IAuditTrailEntryProcessRestoredV2
  | IAuditTrailEntryProcessArchivedV2
  | IAuditTrailEntryDeletionPeriodChangedV2
  | IAuditTrailEntryAutomatedInstanceDeletionV2
  | IAuditTrailEntryInstanceStateErrorV2
  | IAuditTrailEntryErrorSubProcessMappingV2
  | IAuditTrailEntryIntermediateTimerTriggeredManuallyV2
  | IAuditTrailEntryLinkedInstanceDeletedV2
  | IAuditTrailEntryFieldTypeChangedV2
  | IAuditTrailEntrySignalBoundaryEventTriggeredV2
  | IAuditTrailEntryTimerBoundaryEventTriggeredV2
  | IAuditTrailEntryErrorInServiceTaskV2
  | IAuditTrailEntryErrorInScriptTaskV2
  | IAuditTrailEntryInstanceDeletedV2
  | IAuditTrailEntryInstanceCanceledV2
  | IAuditTrailEntryDecisionV2
  | IAuditTrailEntrySetFieldForParentInstanceV2
  | IAuditTrailEntrySubInstanceDeleted
  | IAuditTrailEntrySendTaskV2
  | IAuditTrailEntryEndEventV2
  | IAuditTrailEntryStartEventV2
  | IAuditTrailEntryFieldContentChangedV2
  | IAuditTrailEntryTodoDueAtDateChangedV2
  | IAuditTrailEntryInstanceRoleChangedV2
  | IAuditTrailEntryRetentionPeriodChangedV2
  | IAuditTrailEntryProcessRolesChangedV2
  | IAuditTrailEntryProcessTagsChangedV2
  | IAuditTrailEntryProcessVisibilityChangedV2
  | IAuditTrailEntryProcessDescriptionChangedV2
  | IAuditTrailEntryProcessDisplayNameChangedV2
  | IAuditTrailEntryErrorOnEvaluateGatewayDecisionV2
  | IAuditTrailEntryProcessDeletedV2
  | IAuditTrailEntryProcessCommentV2
  | IAuditTrailEntryProcessEditedV2
  | IAuditTrailEntryProcessCreatedV2
  | IAuditTrailEntryErrorSubprocessV2
  | IAuditTrailEntryMessageBoundaryEventTriggeredV2
  | IAuditTrailEntryOutgoingMailV2
  | IAuditTrailEntryIncomingMailV2
  | IAuditTrailEntryJumpPerformedV2
  | IAuditTrailEntryInstanceCommentV2
  | IAuditTrailEntryProcessXmlChangedByInlineSettingsV2
  | IAuditTrailEntryProcessXmlChangedV2
  | IAuditTrailEntrySetFieldForSubInstanceV2
  | IAuditTrailEntryDataReceivedFromSubInstance
  | IAuditTrailEntryDataReceivedFromParentInstance;
