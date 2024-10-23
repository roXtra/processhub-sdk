import { IFieldValue } from "../data/ifieldvalue.js";
import { IQuestion } from "../modules/audits/iquestioncatalog.js";
import { StateUserDetails } from "../user/phclient.js";

/* eslint-disable @typescript-eslint/naming-convention */
// Enum values should be max. 100 characters long and contain only ascii characters because of the database column type!
export enum AuditTrailAction {
  instanceStarted = "instance started", // Deprecated - startEvent is logged for new instances
  completedTodo = "todo completed",
  comment = "comment",
  incomingMail = "incoming mail",
  jumpPerformed = "jump performed",
  outgoingMail = "outgoing mail",
  instanceStartedByTimer = "instance started by timer", // Deprecated - startEvent is logged for new instances
  messageBoundaryEventTriggered = "message boundary event triggered",
  bouncedMail = "bounced mail",
  errorSubprocess = "error starting subprocess",
  processCreated = "process created",
  processEdited = "process edited",
  processComment = "process comment",
  processDeleted = "process deleted",
  errorOnEvaluateGatewayDecision = "error evaluating gateway decision",
  processDisplayNameChanged = "process display name changed",
  processDescriptionChanged = "process description changed",
  processVisibilityChanged = "process visibility changed",
  processTagsChanged = "process tags changed",
  processXmlChanged = "process xml changed",
  processRolesChanged = "process roles changed",
  retentionPeriodChanged = "retention period changed",
  instanceRoleChanged = "instance role changed",
  todoDueAtDateChanged = "due at date of todo changed",
  fieldContentChanged = "field value changed",
  startEvent = "start event triggered",
  endEvent = "end event reached",
  sendTask = "send task executed",
  setFieldForSubProcess = "set field for subprocess",
  setFieldForParentProcess = "set field for parent process",
  decision = "decision",
  instanceCanceled = "instance canceled",
  instanceDeleted = "instance deleted",
  errorInScriptTask = "error executing script task",
  errorInServiceTask = "error executing service task",
  timerBoundaryEventTriggered = "timer boundary event triggered",
  signalBoundaryEventTriggered = "signal boundary event triggered",
  fieldTypeChanged = "field type changed",
  // An instance linked in a ProcessLink field was deleted. linkedInstanceTitle is set to title of deleted instance in IAuditTrailEntryDetails.
  linkedInstanceDeleted = "linked instance deleted",
  // An intermediate timer was triggered manually. todoDisplayName is set in details
  intermediateTimerTriggeredManually = "intermediate timer triggered manually",
  errorSubProcessMapping = "error mapping fields for subprocess",
  // Instance execution lead to an erroneous state (e.g. no more todos, but no EndEvent was reached)
  instanceStateError = "instance state error",
  automatedInstanceDeletion = "instance automatically deleted",
  deletionPeriodChanged = "deletion period changed",
  // A process was moved to the archive. archiveMessage may be set in details
  processArchived = "process archived",
  // A process was restored from the archive. archiveMessage may be set in details
  processRestored = "process restored",
  // A question in audits was changed
  auditQuestionAdded = "audit question added",
  // The question text of a question was changed
  auditQuestionTextChanged = "audit question text changed",
  // A question in audits was changed
  auditQuestionContentChanged = "audit question content changed",
  // A question in audits was deleted
  auditQuestionDeleted = "audit question deleted",
  workspaceCreated = "workspace created",
  auditTrailVisibilityChanged = "audit trail visibility changed",
  // A task was claimed by a potential roleowner
  activeTaskClaimed = "active task claimed",
  // A user was replaced in a process
  replaceUser = "replaced user",
  // An audit was edited and saved in offline mode
  instanceUpdatedOfflineMode = "instance updated from offline mode",
  errorInSendTask = "error executing send task",
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum AuditTrailProcessFlag {
  Subprocess = 1,
  Parentprocess = 2,
}

export interface IAuditTrailEntryDetails {
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

  // Can be set for processXmlChanged if there is an old bpmn file
  oldXmlFile?: string;
  // Can be set for processXmlChanged if there is an old preview file
  oldPreviewFile?: string;
  // Must be set for processXmlChanged
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
}

export interface IAuditTrailEntry {
  trailId: string;
  workspaceId: string;
  processId?: string; // May be null for entries on workspace-level
  instanceId?: string; // May be null for entries on workspace- or process-level
  action: AuditTrailAction;
  user?: StateUserDetails;
  createdAt: Date; // Time of action in UTC
  entryFrom?: AuditTrailProcessFlag;
  details: IAuditTrailEntryDetails;
}
