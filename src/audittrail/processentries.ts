import { IProcessDetails, IProcessSettings, IRetentionPeriodLock } from "../process/processinterfaces.js";
import { IProcessRoles, IProcessRole } from "../process/processrights.js";
import { IAuditTrailEntryDetails, AuditTrailAction, IBaseAuditTrailEntry } from "./audittrailinterfaces.js";

export interface IAuditTrailEntryProcess extends IBaseAuditTrailEntry {
  instanceId?: undefined;
  processId: string;
  workspaceId: string;
}

export interface IAuditTrailEntryProcessXmlChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: {
      xmlVersion: number;
      xmlFile: string | undefined;
      previewFile: string | undefined;
    };
    newValue: {
      xmlVersion: number;
      xmlFile: string;
      previewFile: string | undefined;
    };
    processDisplayName: string;
  };
  action: AuditTrailAction.processXmlChangedV2;
}

export interface IAuditTrailEntryProcessXmlChangedByInlineSettingsV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: {
      xmlVersion: number;
      xmlFile: string | undefined;
      previewFile: string | undefined;
    };
    newValue: {
      xmlVersion: number;
      xmlFile: string;
      previewFile: string | undefined;
    };
    fieldName: string;
    processDisplayName: string;
  };
  action: AuditTrailAction.processXmlChangedByInlineSettingsV2;
}

export interface IAuditTrailEntryProcessDeletedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    processId: string;
  };
  action: AuditTrailAction.processDeletedV2;
}

export interface IAuditTrailEntryProcessCommentV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    processDisplayName: string;
    comment: string;
  };
  action: AuditTrailAction.processCommentV2;
}

export interface IAuditTrailEntryProcessEditedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: { process: Omit<IProcessDetails, "extras">; settings: IProcessSettings | undefined };
    newValue: { process: Omit<IProcessDetails, "extras">; settings: IProcessSettings | undefined };
  };
  action: AuditTrailAction.processEditedV2;
}

export interface IAuditTrailEntryProcessCreatedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    newValue: { process: Omit<IProcessDetails, "extras">; settings: IProcessSettings | undefined; xmlFile: string | undefined; previewFile: string | undefined };
  };
  action: AuditTrailAction.processCreatedV2;
}

export interface IAuditTrailEntryRetentionPeriodChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.retentionPeriodChangedV2;
}

export interface IAuditTrailEntryProcessRolesChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessRoles | undefined;
    newValue: IProcessRoles | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processRolesChangedV2;
}

export interface IAuditTrailEntryProcessTagsChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string[] | undefined;
    newValue: string[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processTagsChangedV2;
}

export interface IAuditTrailEntryProcessVisibilityChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessRole | undefined;
    newValue: IProcessRole | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processVisibilityChangedV2;
}

export interface IAuditTrailEntryProcessDescriptionChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processDescriptionChangedV2;
}

export interface IAuditTrailEntryProcessDisplayNameChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
  };
  action: AuditTrailAction.processDisplayNameChangedV2;
}

export interface IAuditTrailEntryProcessRestoredV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    processDisplayName: string;
    message: string | undefined;
  };
  action: AuditTrailAction.processRestoredV2;
}

export interface IAuditTrailEntryProcessArchivedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    processDisplayName: string;
    message: string | undefined;
  };
  action: AuditTrailAction.processArchivedV2;
}

export interface IAuditTrailEntryDeletionPeriodChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.deletionPeriodChangedV2;
}

export interface IAuditTrailEntryAutomatedInstanceDeletionV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    deletedInstanceIds: string[];
  };
  action: AuditTrailAction.automatedInstanceDeletionV2;
}

export interface IAuditTrailEntryReplaceUserV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: { userId: string; userDisplayName: string };
    newValue: { userId: string; userDisplayName: string };
  };
  action: AuditTrailAction.replaceUserV2;
}

export interface IAuditTrailEntryAuditTrailVisibilityChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue?: IProcessRole;
    newValue?: IProcessRole;
    processDisplayName: string;
  };
  action: AuditTrailAction.auditTrailVisibilityChangedV2;
}

export interface IAuditTrailEntryRetentionPeriodLockChangedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IRetentionPeriodLock | undefined;
    newValue: IRetentionPeriodLock | undefined;
  };
  action: AuditTrailAction.retentionPeriodLockChangedV2;
}

export interface IAuditTrailEntryInstanceDeletedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    instanceId: string;
  };
  action: AuditTrailAction.instanceDeletedV2;
}
