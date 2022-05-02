import { IFieldValue } from "../data/ifieldvalue";
import { IUserDetails } from "../user/userinterfaces";

/* eslint-disable @typescript-eslint/naming-convention */
export enum AuditTrailAction {
  instanceStarted = 1, // Deprecated - startEvent is logged for new instances
  completedTodo = 2,
  comment = 3,
  incomingMail = 4,
  jumpPerformed = 5,
  outgoingMail = 6,
  instanceStartedByTimer = 7, // Deprecated - startEvent is logged for new instances
  messageBoundaryEventTriggered = 8,
  bouncedMail = 9,
  errorSubprocess = 10,
  processCreated = 11,
  processEdited = 12,
  processComment = 13,
  processDeleted = 14,
  errorOnEvaluateGatewayDecision = 15,
  processDisplayNameChanged = 16,
  processDescriptionChanged = 17,
  processVisibilityChanged = 18,
  processTagsChanged = 19,
  processXmlChanged = 20,
  processRolesChanged = 21,
  retentionPeriodChanged = 22,
  instanceRoleChanged = 23,
  todoDueAtDateChanged = 24,
  fieldContentChanged = 25,
  startEvent = 26,
  endEvent = 27,
  sendTask = 28,
  setFieldForSubProcess = 29,
  setFieldForParentProcess = 30,
  decision = 31,
  instanceCanceled = 32,
  instanceDeleted = 33,
  errorInScriptTask = 34,
  errorInServiceTask = 35,
  timerBoundaryEventTriggered = 36,
  signalBoundaryEventTriggered = 37,
  fieldTypeChanged = 38,
  // An instance linked in a ProcessLink field was deleted. linkedInstanceTitle is set to title of deleted instance in IAuditTrailEntryDetails.
  linkedInstanceDeleted = 39,
  // An intermediate timer was triggered manually. todoDisplayName is set in details
  intermediateTimerTriggeredManually = 40,
  errorSubProcessMapping = 41,
  // Instance execution lead to an erroneous state (e.g. no more todos, but no EndEvent was reached)
  instanceStateError = 42,
  automatedInstanceDeletion = 43,
  deletionPeriodChanged = 44,
  // A process was moved to the archive. archiveMessage may be set in details
  processArchived = 45,
  // A process was restored from the archive. archiveMessage may be set in details
  processRestored = 46,
  workspaceCreated = 100,
  auditTrailVisibilityChanged = 101,
  // A task was claimed by a potential roleowner
  activeTaskClaimed = 102,
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum AuditTrailProcessFlag {
  Subprocess = 1,
  Parentprocess = 2,
}

export interface IAuditTrailEntryDetails {
  // Must be set for completedTodo, todoDueAtDateChanged, decision, errorSubProcees, errorOnEvaluateGatewayDecision, sendTask, intermediateTimerTriggeredManually
  todoDisplayName: string;
  // Must be set for AuditTrailAction.comment and processComment
  comment: string;
  // May be set for AuditTrailAction.comment, if the comment has attachments - links to all attachment files
  commentAttachments: string[];

  // Must be set for AuditTrailAction.incomingMail
  mailText: string;
  // Must be set for AuditTrailAction.incomingMail, sendTask
  mailSubject: string;
  // May be set for AuditTrailAction.incomingMail, if there was html content in the email - link to the HTML document. undefined if there was no HTML content.
  mailHtmlLink: string;
  // May be set for AuditTrailAction.incomingMail, if there were attachments in the mail - links to all attachment files. Empty array if there were no attachments.
  mailAttachments: string[];
  // May be set for AuditTrailAction.outgoingMail and sendTask
  mailReceiverList: string[];
  // Must be set for AuditTrailAction.jumpPerformed
  jumpFromTodoDisplayName: string;
  jumpToTodoDisplayName: string;

  // Must be set for AuditTrailAction.bouncedMail
  bouncedAddresses: string[];
  bouncedSubject: string;

  // Must be set for AuditTrailAction.processCreated, AuditTrailAction.deletionPeriodChanged, processEdited, processComment and processDeleted
  processDisplayName: string;

  // Must be set for AuditTrailAction.retentionPeriodChanged and AuditTrailAction.deletionPeriodChanged
  oldValue: string;
  newValue: string;

  // Must be set for workspaceCreated
  workspaceDisplayName: string;

  // Must be set for instanceRoleChanged
  roleName: string;

  // Must be set for todoDueAtDateChanged
  todoDueAt: Date;

  // Must be set for fieldContentChanged, setFieldForSubProcess, setFieldForParentProcess, fieldTypeChanged, linkedInstanceDeleted
  fieldName: string;
  newFieldValue: IFieldValue;

  // Must be set for startEvent and endEvent
  eventId: string;
  eventName: string;

  // Must be set for startEvent
  startEventType: "TimerStartEvent" | "MessageStartEvent" | "StartEvent";

  // Must be set for sendTask
  htmlMailContent: string;

  // Must be set for decision
  choosenTaskName: string;

  instanceName?: string;

  // Can be set for processXmlChanged if there is an old bpmn file
  oldXmlFile: string;
  // Can be set for processXmlChanged if there is an old preview file
  oldPreviewFile: string;
  // Must be set for processXmlChanged
  oldXmlVersion: number;

  // Must be set for instanceRoleChanged
  newRoleOwnerDisplayNames: string[];

  // Must be set for linkedInstanceDeleted
  linkedInstanceTitle: string;

  // Can be set for errorInScriptTask and errorInServiceTask - information about the error that occured
  errorCode: string;
  errorMessage: string;

  // Must be set for automatedInstanceDeletion, represents the number of automatic deleted instances
  automatedInstanceDeletionCount: number;

  // Can be set for processArchived and processRestored - an optional message the user can enter
  archiveMessage: string;
}

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export interface IAuditTrailEntry {
  trailId: string;
  workspaceId: string;
  processId?: string; // May be null for entries on workspace-level
  instanceId?: string; // May be null for entries on workspace- or process-level
  action: AuditTrailAction;
  user?: IUserDetails;
  createdAt: Date; // Time of action in UTC
  entryFrom?: AuditTrailProcessFlag;
  details: Partial<IAuditTrailEntryDetails>;
}
