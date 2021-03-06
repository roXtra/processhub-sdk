import { IUserDetails } from "../user/userinterfaces";
import { IWorkspaceDetails } from "../workspace/workspaceinterfaces";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { IServiceActionConfigField } from "../data/datainterfaces";
import { IFileStore } from "../filestore";
import { IConfig } from "../serverconfig";
import { BpmnProcess, ProcessExtras, IProcessDetails } from "../process";
import { ISendMailTemplateRequest, ISendMailTemplateReply } from "../mailer/mailerinterfaces";
import { IGenerateReportRequestType } from "../instance";
import { IFieldContentMap } from "../data/ifieldcontentmap";

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
  uploadAttachment(processId: string, instanceId: string, fileName: string, dataBase64: string): Promise<string>;
  generateInstanceReport(instanceIds: string[], draftId: string, type: IGenerateReportRequestType): Promise<{ doc: string /* Base64*/; fileName: string }>;
  executeInstance(processId: string, instance: IInstanceDetails, startEventId?: string, accessToken?: string): Promise<string>;
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
 * RoXtra API methods that ServiceTasks can use
 */
export interface IServiceTaskRoxApi {
  getEfApiToken(): Promise<string>;
  getApiToken(): string;
  getRoxtraTokenByUserId(userId: string): Promise<string>;
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
