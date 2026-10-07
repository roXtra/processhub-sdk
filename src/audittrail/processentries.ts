import { IAuditMetricCategory } from "../modules/audits/iauditmetriccategory.js";
import IAuditsSettings from "../modules/audits/iauditssettings.js";
import { ICustomRating } from "../modules/audits/icustomrating.js";
import { IGenericModuleChartField, IGenericModuleSettings } from "../modules/imodule.js";
import { IProcessAttachment, IProcessDetails, IProcessReportDraft, IProcessSettings, IRetentionPeriodLock, IStartButtonMap } from "../process/processinterfaces.js";
import { IProcessRoles, IProcessRole } from "../process/processrights.js";
import { IRiskAssessmentDimension, IRiskManagementColor, IRiskManagementProcessSettings } from "../riskassessment/riskassessmentinterfaces.js";
import { IAuditTrailEntryDetails, AuditTrailAction, IBaseAuditTrailEntry } from "./audittrailinterfaces.js";

export interface IAuditTrailEntryProcess extends IBaseAuditTrailEntry {
  instanceId?: undefined;
  processId: string;
  workspaceId: string;
}

export interface IAuditTrailProcessDetails {
  processId: string;
  displayName: string;
  urlName: string | undefined;
  description: string;
  useModeler: boolean;
  attachments: IProcessAttachment[];
  reportDrafts: IProcessReportDraft[];
  statisticsReportDrafts: IProcessReportDraft[];
  processXmlHash: string | undefined;
  userStartEvents: IStartButtonMap; // Map with starteventid -> start event name
  tags: string[];
  hasWarnings: boolean;
  retentionPeriod: number | undefined; // Retention period for insatances in months
  deletionPeriod: number | undefined; // Deletion period for insatances in months
  jumpsDisabled: boolean;
  xmlVersion: number | undefined;
  parentProcessIds: string[];
  childProcessIds: string[];
  riskManagementSettings: IRiskManagementProcessSettings | undefined;
  genericModuleSettings: IGenericModuleSettings | undefined;
  auditsSettings: IAuditsSettings | undefined;
  instanceCount: number;
  archived: boolean; // True, if the process is archived, false or undefined otherwise
  reactivateTaskId: string | undefined; // The usertask ID that is used for reactivating instances
  processRoles: IProcessRoles | undefined;
  settings: IProcessSettings | undefined;
}

export function toAuditTrailProcessDetails(entry: IProcessDetails): IAuditTrailProcessDetails {
  return {
    processId: entry.processId,
    displayName: entry.displayName,
    urlName: entry.urlName,
    description: entry.description,
    useModeler: entry.useModeler ?? false,
    attachments: entry.attachments ?? [],
    reportDrafts: entry.reportDrafts ?? [],
    statisticsReportDrafts: entry.statisticsReportDrafts ?? [],
    processXmlHash: entry.processXmlHash,
    userStartEvents: entry.userStartEvents ?? {},
    tags: entry.tags ?? [],
    hasWarnings: entry.hasWarnings ?? false,
    retentionPeriod: entry.retentionPeriod,
    deletionPeriod: entry.deletionPeriod,
    jumpsDisabled: entry.jumpsDisabled ?? false,
    xmlVersion: entry.xmlVersion,
    parentProcessIds: entry.parentProcessIds ?? [],
    childProcessIds: entry.childProcessIds ?? [],
    riskManagementSettings: entry.riskManagementSettings,
    genericModuleSettings: entry.genericModuleSettings,
    auditsSettings: entry.auditsSettings,
    instanceCount: entry.instanceCount ?? 0,
    archived: entry.archived ?? false,
    reactivateTaskId: entry.reactivateTaskId,
    processRoles: entry.extras.processRoles,
    settings: entry.extras.settings,
  };
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
    oldValue: {
      process: IAuditTrailProcessDetails;
    };
    newValue: { process: IAuditTrailProcessDetails };
  };
  action: AuditTrailAction.processEditedV2;
}

export interface IAuditTrailEntryProcessCreatedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    newValue: { process: IAuditTrailProcessDetails; xmlFile: string | undefined; previewFile: string | undefined };
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
    processDisplayName?: string;
  };
  action: AuditTrailAction.retentionPeriodLockChangedV2;
}

export interface IAuditTrailEntryInstanceDeletedV2 extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    instanceId: string;
  };
  action: AuditTrailAction.instanceDeletedV2;
}

export interface IAuditTrailEntryProcessOwnerChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessRole | undefined;
    newValue: IProcessRole | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processOwnerChanged;
}

export interface IAuditTrailEntryProcessManagerChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessRole | undefined;
    newValue: IProcessRole | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processManagerChanged;
}

export interface IAuditTrailEntryProcessDashboardViewerChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessRole | undefined;
    newValue: IProcessRole | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processDashboardViewerChanged;
}
export interface IAuditTrailEntryProcessAttachmentsChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessAttachment[] | undefined;
    newValue: IProcessAttachment[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processAttachmentsChanged;
}

export interface IAuditTrailEntryProcessRiskDimensionsChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IRiskAssessmentDimension[] | undefined;
    newValue: IRiskAssessmentDimension[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processRiskDimensionsChanged;
}

export interface IAuditTrailEntryProcessRiskMetricsExpressionChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processRiskMetricsExpressionChanged;
}

export interface IAuditTrailEntryProcessRiskDefaultRPZFieldChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processRiskDefaultRPZFieldChanged;
}

export interface IAuditTrailEntryProcessRiskMetricsColorCategoriesChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IRiskManagementColor[] | undefined;
    newValue: IRiskManagementColor[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processRiskMetricsColorCategoriesChanged;
}

export interface IAuditTrailEntryProcessRiskHideRiskMatrixChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: boolean | undefined;
    newValue: boolean | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processRiskHideRiskMatrixChanged;
}

export interface IAuditTrailEntryProcessAuditCustomRatingChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: ICustomRating | undefined;
    newValue: ICustomRating | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processAuditCustomRatingChanged;
}

export interface IAuditTrailEntryProcessAuditMetricSettingsChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IAuditMetricCategory[] | undefined;
    newValue: IAuditMetricCategory[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processAuditMetricSettingsChanged;
}

export interface IAuditTrailEntryProcessDefaultStatusFieldChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processDefaultStatusFieldChanged;
}

export interface IAuditTrailEntryProcessJumpsDisabledChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: boolean | undefined;
    newValue: boolean | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processJumpsDisabledChanged;
}

export interface IAuditTrailEntryProcessInstanceReactivationTaskIdChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processInstanceReactivationTaskIdChanged;
}

export interface IAuditTrailEntryProcessReportDraftsChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessReportDraft[] | undefined;
    newValue: IProcessReportDraft[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processReportDraftsChanged;
}

export interface IAuditTrailEntryProcessStatisticsReportDraftsChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IProcessReportDraft[] | undefined;
    newValue: IProcessReportDraft[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processStatisticsReportDraftsChanged;
}

export interface IAuditTrailEntryProcessDashboardTitleChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: string | undefined;
    newValue: string | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processDashboardTitleChanged;
}

export interface IAuditTrailEntryProcessGenericModulesSettingsChartFieldsChanged extends IAuditTrailEntryProcess {
  details: IAuditTrailEntryDetails & {
    oldValue: IGenericModuleChartField[] | undefined;
    newValue: IGenericModuleChartField[] | undefined;
    processDisplayName: string;
  };
  action: AuditTrailAction.processGenericModulesSettingsChartFieldsChanged;
}
