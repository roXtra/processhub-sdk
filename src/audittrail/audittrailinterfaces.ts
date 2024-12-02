import { IFieldValue } from "../data/ifieldvalue.js";
import { IQuestion } from "../modules/audits/iquestioncatalog.js";
import { IRetentionPeriodLock } from "../process/processinterfaces.js";
import { StateUserDetails } from "../user/phclient.js";

/* eslint-disable @typescript-eslint/naming-convention */
// Enum values should be max. 100 characters long and contain only ascii characters because of the database column type!
export enum AuditTrailAction {
  /**
   * completedTodoV2 should be used for new events
   */
  completedTodo = "todo completed",
  /**
   * processXmlChangedV2 should be used for new events
   */
  processXmlChanged = "process xml changed",
  /**
   * processXmlChangedByInlineSettingsV2 should be used for new events
   */
  processXmlChangedByInlineSettings = "process xml changed by inline settings",
  /**
   * startEvent is logged for new instances
   */
  instanceStarted = "instance started",
  /**
   * instanceCommentV2 should be used for new events
   */
  comment = "comment",
  /**
   * jumpPerformedV2 should be used for new events
   */
  jumpPerformed = "jump performed",
  /**
   * incomingMailV2 should be used for new events
   */
  incomingMail = "incoming mail",
  /**
   * outgoingMailV2 should be used for new events
   */
  outgoingMail = "outgoing mail",
  /**
   * startEvent is logged for new instances
   */
  instanceStartedByTimer = "instance started by timer",
  /**
   * messageBoundaryEventTriggeredV2 should be used for new events
   */
  messageBoundaryEventTriggered = "message boundary event triggered",
  /**
   * this event is not used anymore
   */
  bouncedMail = "bounced mail",
  /**
   * errorSubprocessV2 should be used for new events
   */
  errorSubprocess = "error starting subprocess",
  /**
   * processCreatedV2 should be used for new events
   */
  processCreated = "process created",
  /**
   * processEditedV2 should be used for new events
   */
  processEdited = "process edited",
  /**
   * processCommentV2 should be used for new events
   */
  processComment = "process comment",
  /**
   * processDeletedV2 should be used for new events
   */
  processDeleted = "process deleted",
  /**
   * errorOnEvaluateGatewayDecisionV2 should be used for new events
   */
  errorOnEvaluateGatewayDecision = "error evaluating gateway decision",
  /**
   * processDisplayNameChangedV2 should be used for new events
   */
  processDisplayNameChanged = "process display name changed",
  /**
   * processDescriptionChangedV2 should be used for new events
   */
  processDescriptionChanged = "process description changed",
  /**
   * processVisibilityChangedV2 should be used for new events
   */
  processVisibilityChanged = "process visibility changed",
  /**
   * processTagsChangedV2 should be used for new events
   */
  processTagsChanged = "process tags changed",
  /**
   * processRolesChangedV2 should be used for new events
   */
  processRolesChanged = "process roles changed",
  /**
   * retentionPeriodChangedV2 should be used for new events
   */
  retentionPeriodChanged = "retention period changed",
  /**
   * instanceRoleChangedV2 should be used for new events
   */
  instanceRoleChanged = "instance role changed",
  /**
   * todoDueAtDateChangedV2 should be used for new events
   */
  todoDueAtDateChanged = "due at date of todo changed",
  /**
   * fieldContentChangedV2 should be used for new events
   */
  fieldContentChanged = "field value changed",
  /**
   * startEventV2 should be used for new events
   */
  startEvent = "start event triggered",
  /**
   * endEventV2 should be used for new events
   */
  endEvent = "end event reached",
  /**
   * sendTaskV2 should be used for new events
   */
  sendTask = "send task executed",
  /**
   * setFieldForSubInstanceV2 should be used for new events
   */
  setFieldForSubProcess = "set field for subprocess",
  /**
   * setFieldForParentInstanceV2 should be used for new events
   */
  setFieldForParentProcess = "set field for parent process",
  /**
   * decisionV2 should be used for new events
   */
  decision = "decision",
  /**
   * instanceCanceledV2 should be used for new events
   */
  instanceCanceled = "instance canceled",
  /**
   * instanceDeletedV2 should be used for new events
   */
  instanceDeleted = "instance deleted",
  /**
   * errorInScriptTaskV2 should be used for new events
   */
  errorInScriptTask = "error executing script task",
  /**
   * errorInServiceTaskV2 should be used for new events
   */
  errorInServiceTask = "error executing service task",
  /**
   * timerBoundaryEventTriggeredV2 should be used for new events
   */
  timerBoundaryEventTriggered = "timer boundary event triggered",
  /**
   * signalBoundaryEventTriggeredV2 should be used for new events
   */
  signalBoundaryEventTriggered = "signal boundary event triggered",
  /**
   * fieldTypeChangedV2 should be used for new events
   */
  fieldTypeChanged = "field type changed",
  /**
   * linkedInstanceDeletedV2 should be used for new events
   */
  linkedInstanceDeleted = "linked instance deleted",
  /**
   * use intermediateTimerTriggeredManuallyV2 for new events
   */
  intermediateTimerTriggeredManually = "intermediate timer triggered manually",
  /**
   * errorSubProcessMappingV2 should be used for new events
   */
  errorSubProcessMapping = "error mapping fields for subprocess",
  /**
   * instanceStateErrorV2 should be used for new events
   */
  instanceStateError = "instance state error",
  /**
   * automatedInstanceDeletionV2 should be used for new events
   */
  automatedInstanceDeletion = "instance automatically deleted",
  /**
   * deletionPeriodChangedV2 should be used for new events
   */
  deletionPeriodChanged = "deletion period changed",
  /**
   * processArchivedV2 should be used for new events
   */
  processArchived = "process archived",
  /**
   * processRestoredV2 should be used for new events
   */
  processRestored = "process restored",
  /**
   * auditQuestionAddedV2 should be used for new events
   */
  auditQuestionAdded = "audit question added",
  /**
   * auditQuestionTextChangedV2 should be used for new events
   */
  auditQuestionTextChanged = "audit question text changed",
  /**
   * auditQuestionContentChangedV2 should be used for new events
   */
  auditQuestionContentChanged = "audit question content changed",
  /**
   * auditQuestionDeletedV2 should be used for new events
   */
  auditQuestionDeleted = "audit question deleted",
  /**
   * auditTrailVisibilityChangedV2 should be used for new events
   */
  auditTrailVisibilityChanged = "audit trail visibility changed",
  /**
   * is not used anymore, exists only for old instances
   */
  activeTaskClaimed = "active task claimed",
  /**
   * replaceUserV2 should be used for new events
   */
  replaceUser = "replaced user",
  /**
   * instanceUpdatedOfflineModeV2 should be used for new events
   */
  instanceUpdatedOfflineMode = "instance updated from offline mode",
  /**
   * errorInSendTaskV2 should be used for new events
   */
  errorInSendTask = "error executing send task",
  /**
   * retentionPeriodLockChangedV2 should be used for new events
   */
  retentionPeriodLockChanged = "retention period lock changed",

  /**
   * A todo was completed
   */
  completedTodoV2 = "todo completed v2",
  /**
   * The retention period lock of a process was changed
   */
  retentionPeriodLockChangedV2 = "retention period lock changed v2",
  /**
   * An error occured during the execution of a send task
   */
  errorInSendTaskV2 = "error executing send task v2",
  /**
   * An audit was edited and saved in offline mode
   */
  instanceUpdatedOfflineModeV2 = "instance updated from offline mode v2",
  /**
   * An user was replaced in a process
   */
  replaceUserV2 = "replaced user v2",
  /**
   * Audit trail visibility was changed
   */
  auditTrailVisibilityChangedV2 = "audit trail visibility changed v2",
  /**
   * An audit question was deleted
   */
  auditQuestionDeletedV2 = "audit question deleted v2",
  /**
   * Audit question content was changed
   */
  auditQuestionContentChangedV2 = "audit question content changed v2",
  /**
   * Audit question text was changed
   */
  auditQuestionTextChangedV2 = "audit question text changed v2",
  /**
   * An audit question was added
   */
  auditQuestionAddedV2 = "audit question added v2",
  /**
   * A process was restored from the archive
   */
  processRestoredV2 = "process restored v2",
  /**
   * A process was archived
   */
  processArchivedV2 = "process archived v2",
  /**
   * Deletion period of a process was changed
   */
  deletionPeriodChangedV2 = "deletion period changed v2",
  /**
   * An instance was deleted automatically
   */
  automatedInstanceDeletionV2 = "instance automatically deleted v2",
  /**
   * Instance execution lead to an erroneous state (e.g. no more todos, but no EndEvent was reached)
   */
  instanceStateErrorV2 = "instance state error v2",
  /**
   * Error mapping fields for subprocess
   */
  errorSubProcessMappingV2 = "error mapping fields for subprocess v2",
  /**
   * An intermediate timer was triggered manually
   */
  intermediateTimerTriggeredManuallyV2 = "intermediate timer triggered manually v2",
  /**
   * An instance linked in a ProcessLink field was deleted
   */
  linkedInstanceDeletedV2 = "linked instance deleted v2",
  /**
   * The type of an instance field was changed
   */
  fieldTypeChangedV2 = "field type changed v2",
  /**
   * A signal boundary event was triggered
   */
  signalBoundaryEventTriggeredV2 = "signal boundary event triggered v2",
  /**
   * A timer boundary event was triggered
   */
  timerBoundaryEventTriggeredV2 = "timer boundary event triggered v2",
  /**
   * An error occured during the execution of a service task
   */
  errorInServiceTaskV2 = "error executing service task v2",
  /**
   * An error occured during the execution of a script task
   */
  errorInScriptTaskV2 = "error executing script task v2",
  /**
   * An instance was deleted
   */
  instanceDeletedV2 = "instance deleted v2",
  /**
   * An instance was canceled
   */
  instanceCanceledV2 = "instance canceled v2",
  /**
   * The user decided which flow to take
   */
  decisionV2 = "decision v2",
  /**
   * Field was set for parent instance from a sub instance
   */
  setFieldForParentInstanceV2 = "set field for parent instance v2",
  /**
   * Field was set for sub instance from a parent instance
   */
  setFieldForSubInstanceV2 = "set field for sub instance v2",
  /**
   * A send task was executed
   */
  sendTaskV2 = "send task executed v2",
  /**
   * A sub instance was deleted
   */
  subInstanceDeleted = "sub instance deleted ",
  /**
   * An end event was reached
   */
  endEventV2 = "end event reached v2",
  /**
   * A start event was triggered
   */
  startEventV2 = "start event triggered v2",
  /**
   * Value of a field was changed
   */
  fieldContentChangedV2 = "field value changed v2",
  /**
   * Due date of a todo was changed
   */
  todoDueAtDateChangedV2 = "due at date of todo changed v2",
  /**
   * Instance role owner was changed
   */
  instanceRoleChangedV2 = "instance role changed v2",
  /**
   * Retention period lock of a process was changed
   */
  retentionPeriodChangedV2 = "retention period changed v2",
  /**
   * Process roles were changed
   */
  processRolesChangedV2 = "process roles changed v2",
  /**
   * Process tags were changed
   */
  processTagsChangedV2 = "process tags changed v2",
  /**
   * Process visibility was changed
   */
  processVisibilityChangedV2 = "process visibility changed v2",
  /**
   * Process description was changed
   */
  processDescriptionChangedV2 = "process description changed v2",
  /**
   * Process display name was changed
   */
  processDisplayNameChangedV2 = "process display name changed v2",
  /**
   * An error occured evaluating a gateway decision
   */
  errorOnEvaluateGatewayDecisionV2 = "error evaluating gateway decision v2",
  /**
   * A process was deleted
   */
  processDeletedV2 = "process deleted v2",
  /**
   * A process was commented
   */
  processCommentV2 = "process comment v2",
  /**
   * Process was edited
   */
  processEditedV2 = "process edited v2",
  /**
   * A process was created
   */
  processCreatedV2 = "process created v2",
  /**
   * A sub process could not be started
   */
  errorSubprocessV2 = "error starting subprocess v2",
  /**
   * A message boundary event was triggered
   */
  messageBoundaryEventTriggeredV2 = "message boundary event triggered v2",
  /**
   * An outgoing mail was sent
   */
  outgoingMailV2 = "outgoing mail v2",
  /**
   * An incoming mail was received
   */
  incomingMailV2 = "incoming mail v2",
  /**
   * Jump was performed
   */
  jumpPerformedV2 = "jump performed v2",
  /**
   * A comment was added to an instance
   */
  instanceCommentV2 = "instance comment v2",
  /**
   * Process xml was updated by changing a field in the inline settings
   */
  processXmlChangedByInlineSettingsV2 = "process xml changed by inline settings v2",
  /**
   * Process xml was updated
   */
  processXmlChangedV2 = "process xml changed v2",
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum AuditTrailProcessFlag {
  Subprocess = 1,
  Parentprocess = 2,
}

export interface ILegacyAuditTrailEntryDetails {
  // Must be set for all audit trail entries - the display name of the user that performed the action at the time of the action
  userDisplayName: string;

  // Must be set for completedTodo, todoDueAtDateChanged, decision, errorSubProcees, errorOnEvaluateGatewayDecision, sendTask, intermediateTimerTriggeredManually
  todoDisplayName?: string;
  // Must be set for AuditTrailAction.comment and processComment
  comment?: string;
  // May be set for AuditTrailAction.comment, if the comment has attachments - links to all attachment files
  commentAttachments?: string[];
  // Must be set for AuditTrailAction.incomingMail
  mailText?: string;
  // Must be set for AuditTrailAction.incomingMail, sendTask
  mailSubject?: string;
  // May be set for AuditTrailAction.incomingMail, if there was html content in the email - link to the HTML document. undefined if there was no HTML content.
  mailHtmlLink?: string;
  // May be set for AuditTrailAction.incomingMail, if there were attachments in the mail - links to all attachment files. Empty array if there were no attachments.
  mailAttachments?: string[];
  // May be set for AuditTrailAction.outgoingMail and sendTask
  mailReceiverList?: string[];
  // Must be set for AuditTrailAction.jumpPerformed
  jumpFromTodoDisplayName?: string;
  jumpToTodoDisplayName?: string;
  // Must be set for AuditTrailAction.bouncedMail
  bouncedAddresses?: string[];
  bouncedSubject?: string;
  // Must be set for AuditTrailAction.processCreated, AuditTrailAction.deletionPeriodChanged, processEdited, processComment and processDeleted
  processDisplayName?: string;
  // Must be set for AuditTrailAction.retentionPeriodChanged, AuditTrailAction.deletionPeriodChanged and AuditTrailAction..auditQuestionTextChanged
  oldValue?: string;
  newValue?: string;

  // Must be set for workspaceCreated
  workspaceDisplayName?: string;

  // Must be set for instanceRoleChanged
  roleName?: string;

  // Must be set for todoDueAtDateChanged
  todoDueAt?: Date;

  // Must be set for fieldContentChanged, setFieldForSubProcess, setFieldForParentProcess, fieldTypeChanged, linkedInstanceDeleted
  fieldName?: string;
  newFieldValue?: IFieldValue;

  // Must be set for startEvent and endEvent
  eventId?: string;
  eventName?: string;

  // Must be set for startEvent
  startEventType?: "TimerStartEvent" | "MessageStartEvent" | "StartEvent";

  // Must be set for sendTask
  htmlMailContent?: string;

  // Must be set for decision
  choosenTaskName?: string;

  instanceName?: string;

  // Can be set for processXmlChanged | processXmlChangedByInlineSettings if there is an old bpmn file
  oldXmlFile?: string;
  // Can be set for processXmlChanged | processXmlChangedByInlineSettings if there is an old preview file
  oldPreviewFile?: string;
  // Must be set for processXmlChanged | processXmlChangedByInlineSettings
  oldXmlVersion?: number;

  // Must be set for instanceRoleChanged
  newRoleOwnerDisplayNames?: string[];

  // Must be set for linkedInstanceDeleted
  linkedInstanceTitle?: string;

  // Can be set for errorInScriptTask and errorInServiceTask - information about the error that occured
  errorCode?: string;
  errorMessage?: string;

  // Must be set for automatedInstanceDeletion, represents the number of automatic deleted instances
  automatedInstanceDeletionCount?: number;

  // Can be set for processArchived and processRestored - an optional message the user can enter
  archiveMessage?: string;

  // Displayname of the user that was replaced
  userToReplace?: string;

  // ID of the user that was replaced
  userToReplaceId?: string;

  // Displayname of the user that replaced the user of userToReplace
  userThatReplaces?: string;

  // ID of the user that replaced the user of userToReplace
  userThatReplacesId?: string;

  // The changed question that only includes changed props and changed customFields, also used for new and deleted questions
  changedQuestion?: Partial<IQuestion>;

  // Required for audit trail entries that refers to an audit question
  questionId?: string;

  // Must be set for locking or unlocking retention period
  retentionPeriodLock?: IRetentionPeriodLock;

  // Must be set for todo sign actions
  todoSignVerified?: boolean;

  // Can be set in addition to todoSignVerified to specify sequence flow name
  flowName?: string;

  // Can be set in addition to todoSignVerified to tell if it isGxP
  isGxp?: boolean;
}

export interface IBaseAuditTrailEntry {
  trailId: string;
  workspaceId: string;
  processId?: string; // May be null for entries on workspace-level
  instanceId?: string; // May be null for entries on workspace- or process-level
  action: AuditTrailAction;
  user?: StateUserDetails;
  createdAt: Date; // Time of action in UTC
  entryFrom?: AuditTrailProcessFlag;
  details: unknown;
}

export interface ILegacyAuditTrailEntry extends IBaseAuditTrailEntry {
  action:
    | AuditTrailAction.activeTaskClaimed
    | AuditTrailAction.auditQuestionAdded
    | AuditTrailAction.auditQuestionContentChanged
    | AuditTrailAction.auditQuestionDeleted
    | AuditTrailAction.auditQuestionTextChanged
    | AuditTrailAction.comment
    | AuditTrailAction.completedTodo
    | AuditTrailAction.decision
    | AuditTrailAction.endEvent
    | AuditTrailAction.errorInScriptTask
    | AuditTrailAction.errorInServiceTask
    | AuditTrailAction.errorOnEvaluateGatewayDecision
    | AuditTrailAction.errorSubprocess
    | AuditTrailAction.fieldContentChanged
    | AuditTrailAction.instanceCanceled
    | AuditTrailAction.instanceDeleted
    | AuditTrailAction.instanceRoleChanged
    | AuditTrailAction.instanceStarted
    | AuditTrailAction.intermediateTimerTriggeredManually
    | AuditTrailAction.jumpPerformed
    | AuditTrailAction.messageBoundaryEventTriggered
    | AuditTrailAction.outgoingMail
    | AuditTrailAction.processArchived
    | AuditTrailAction.processComment
    | AuditTrailAction.processCreated
    | AuditTrailAction.processDeleted
    | AuditTrailAction.processDescriptionChanged
    | AuditTrailAction.processDisplayNameChanged
    | AuditTrailAction.processEdited
    | AuditTrailAction.processRolesChanged
    | AuditTrailAction.processTagsChanged
    | AuditTrailAction.processVisibilityChanged
    | AuditTrailAction.processXmlChanged
    | AuditTrailAction.processXmlChangedByInlineSettings
    | AuditTrailAction.retentionPeriodChanged
    | AuditTrailAction.sendTask
    | AuditTrailAction.setFieldForParentProcess
    | AuditTrailAction.setFieldForSubProcess
    | AuditTrailAction.startEvent
    | AuditTrailAction.todoDueAtDateChanged
    | AuditTrailAction.timerBoundaryEventTriggered
    | AuditTrailAction.signalBoundaryEventTriggered
    | AuditTrailAction.fieldTypeChanged
    | AuditTrailAction.linkedInstanceDeleted
    | AuditTrailAction.errorSubProcessMapping
    | AuditTrailAction.instanceStateError
    | AuditTrailAction.automatedInstanceDeletion
    | AuditTrailAction.deletionPeriodChanged
    | AuditTrailAction.processRestored
    | AuditTrailAction.auditTrailVisibilityChanged
    | AuditTrailAction.replaceUser
    | AuditTrailAction.instanceUpdatedOfflineMode
    | AuditTrailAction.errorInSendTask
    | AuditTrailAction.retentionPeriodLockChanged
    | AuditTrailAction.bouncedMail
    | AuditTrailAction.incomingMail
    | AuditTrailAction.instanceStartedByTimer;
  details: ILegacyAuditTrailEntryDetails;
}

export interface IAuditTrailEntryDetails {
  userDisplayName: string;
  instanceName?: string;
  todoSignVerified?: boolean;
  isGxp?: boolean;
}
