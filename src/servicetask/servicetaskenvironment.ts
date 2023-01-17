import { IUserDetails, UserExtras } from "../user/userinterfaces";
import { IWorkspaceDetails, WorkspaceExtras } from "../workspace/workspaceinterfaces";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { IServiceActionConfigField } from "../data/datainterfaces";
import { ISendMailTemplateRequest, ISendMailTemplateReply } from "../mailer/mailerinterfaces";
import { IFieldContentMap } from "../data/ifieldcontentmap";
import { IProcessDetails, ProcessExtras } from "../process/processinterfaces";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { IFileStore } from "../filestore/ifilestore";
import { IGenerateReportRequestType } from "../instance/legacyapi";
import { IConfig } from "../serverconfig/iconfig";

/**
 * Provide logging for ServiceTasks
 */
export interface IServiceTaskLogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
}

/**
 * Instance methods that ServiceTasks can use
 */
export interface IServiceTaskInstances {
  updateInstance(instanceDetails: IInstanceDetails): Promise<IInstanceDetails>;
  uploadAttachment(instanceId: string, fileName: string, data: Buffer): Promise<string>;
  generateInstanceReport(processId: string, instanceIds: string[], draftId: string, type: IGenerateReportRequestType): Promise<{ doc: string /* Base64*/; fileName: string }>;
  executeInstance(processId: string, instance: IInstanceDetails, startEventId?: string, accessToken?: string): Promise<string>;
  getInstanceUrl(instanceId: string, workspaceId: string, moduleId: number, isUsedThroughTest?: boolean): string;
}

/**
 * Mailer methods that ServiceTasks can use
 */
export interface IServiceTaskMailer {
  sendMailTemplate(request: ISendMailTemplateRequest): Promise<ISendMailTemplateReply>;
}

/**
 * Process methods that SericeTasks can use
 */
export interface IServiceTaskProcesses {
  getProcessDetails(processId: string, extras: ProcessExtras): Promise<IProcessDetails>;
}

/**
 * Workspace methods that SericeTasks can use
 */
export interface IServiceTaskWorkspaces {
  getWorkspaceDetails(workspaceId: string, extras: WorkspaceExtras): Promise<IWorkspaceDetails | undefined>;
}

/**
 * User methods that SericeTasks can use
 */
export interface IServiceTaskUsers {
  getUserDetails(userId: string, extras: UserExtras): Promise<IUserDetails | undefined>;
  getUserIdByMail(mail: string): Promise<string | undefined>;
}

/**
 * RoXtra API methods that ServiceTasks can use
 */
export interface IServiceTaskRoxApi {
  getEfApiToken(): Promise<string>;
  getApiToken(): string;
  getRoxtraTokenByUserId(userId: string): Promise<string>;
  getSupervisor(userId: string): Promise<{ type: "group" | "user" | "error"; value: string | number }>;
}

/**
 * System methods that ServiceTasks can use
 */
export interface IServiceTaskSystem {
  /**
   * Sets the maximum number of iterations for a bpmn element during a resume call.
   * @param count The maximum number of iterations for a bpmn element. An error will be thrown and instance execution will be stopped once it is exceeded.
   */
  setMaxBpmnEngineIterations(count: number): void;
  /**
   * Sets timeout for future database transactions, in ms. This does not change the timeout for the currently running transaction.
   * @param timeout timeout in ms
   */
  setTransactionTimeout(timeout: number): Promise<void>;
}

export interface IServiceTaskEnvironment {
  bpmnXml: string;
  bpmnTaskId: string;
  bpmnTaskName: string;
  /**
   * @deprecated user instanceDetails.fieldContents
   */
  fieldContents: IFieldContentMap;
  instanceDetails: IInstanceDetails;
  instances: IServiceTaskInstances;
  logger: IServiceTaskLogger;
  processes: IServiceTaskProcesses;
  workspaces: IServiceTaskWorkspaces;
  users: IServiceTaskUsers;
  system: IServiceTaskSystem;
  roxApi: IServiceTaskRoxApi;
  mailer: IServiceTaskMailer;
  workspace: IWorkspaceDetails;
  sender: IUserDetails;
  fileStore: IFileStore;
  serverConfig: IConfig;
}

export async function getFields(environment: IServiceTaskEnvironment): Promise<IServiceActionConfigField[]> {
  const processObject: BpmnProcess = new BpmnProcess();
  await processObject.loadXml(environment.bpmnXml);
  const taskObject = processObject.getExistingTask(processObject.processId(), environment.bpmnTaskId);
  const extensionValues = BpmnProcess.getExtensionValues(taskObject);
  const config = extensionValues.serviceTaskConfigObject;

  if (config) {
    return config.fields;
  } else {
    return [];
  }
}
