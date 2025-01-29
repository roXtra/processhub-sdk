import { IUserDetails, UserExtras } from "../user/userinterfaces.js";
import { IWorkspaceDetails, WorkspaceExtras } from "../workspace/workspaceinterfaces.js";
import { IInstanceDetails, InstanceExtras } from "../instance/instanceinterfaces.js";
import { IServiceActionConfigField } from "../data/datainterfaces.js";
import { ISendMailTemplateRequest, ISendMailTemplateReply } from "../mailer/mailerinterfaces.js";
import { IFieldContentMap } from "../data/ifieldcontentmap.js";
import { IProcessDetails, ProcessExtras } from "../process/processinterfaces.js";
import { BpmnProcess } from "../process/bpmn/bpmnprocess.js";
import { IFileStore } from "../filestore/ifilestore.js";
import { IGenerateReportRequestType } from "../instance/legacyapi.js";
import { IConfig } from "../serverconfig/iconfig.js";
import { IUserFieldsConfig } from "../config.js";

/**
 * Provide vm environment for ServiceTasks
 */
export interface IServiceTaskVM extends Disposable {
  init(): Promise<void>;
  /**
   * Evaluates a code string in the VM
   * @param code Code to evaluate
   * @returns Result of the evaluation
   */
  evalCode(code: string): unknown;
  /**
   * Sets a global variable/function in the VM
   * @param name Name of the global variable
   * @param value Value of the global variable
   */
  setGlobal(name: string, value: unknown): void;
  /**
   * Get a global variable from the VM
   * @param name Name of the global variable
   * @returns Value of the global variable
   */
  getGlobal(name: string): unknown;
}

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
  /**
   * Returns all instances for a process, also the ones the user running the service task is usually not allowed to see.
   * @param processId The process to get the instances for
   * @param extras Additional information to include in the instances
   * @returns All instances for the process - also the ones the user running the service task is usually not allowed to see.
   */
  getAllInstancesForProcess(processId: string, extras: InstanceExtras): Promise<IInstanceDetails[]>;
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
  getEfApiEndpoint(): string;
  getApiToken(): string;
  getAccessTokenFromAuth(userId: string): Promise<string>;
  getSupervisor(userId: string): Promise<{ type: "group" | "user" | "error"; value: string | number }>;
  getUsersConfig(): Promise<IUserFieldsConfig>;
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
  // Url of the RoXtra instance, eg https://example.com/roxtra/
  roXtraBaseUrl: string;
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
  getVM: () => IServiceTaskVM;
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
