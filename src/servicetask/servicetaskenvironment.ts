import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { FieldContentMap } from "../data/datainterfaces";
import { IFileStore } from "../filestore";
import { IConfig } from "../serverconfig";
import { BpmnProcess, ProcessExtras, ProcessDetails } from "../process";
import { SendMailTemplateRequest, SendMailTemplateReply } from "../mailer/mailerinterfaces";

/**
 * Instance methods that ServiceTasks can use
 */
export interface IServiceTaskInstances {
  updateInstance(instanceDetails: InstanceDetails): Promise<InstanceDetails>;
  uploadAttachment(processId: string, instanceId: string, fileName: string, dataBase64: string): Promise<string>;
  generateInstanceReport(instanceIdStrings: string, draftId: string, type: "docx" | "pdf"): Promise<{ doc: Buffer; fileName: string }>;
  executeInstance(processId: string, instance: InstanceDetails, startEventId?: string, accessToken?: string): Promise<string>;
}

/**
 * Mailer methods that ServiceTasks can use
 */
export interface IServiceTaskMailer {
  sendMailTemplate(request: SendMailTemplateRequest): Promise<SendMailTemplateReply>;
}

/**
 * Process methods that SericeTasks can use
 */
export interface IServiceTaskProcesses {
  getProcessDetails(processId: string, extras: ProcessExtras): Promise<ProcessDetails>;
}

/**
 * RoXtra API methods that ServiceTasks can use
 */
export interface IServiceTaskRoxApi {
  getEfApiToken(): Promise<string>;
  getApiToken(): string;
  getRoxtraTokenByUserId(userId: string): Promise<string>;
}

export interface ServiceTaskEnvironment {
  bpmnXml: string;
  bpmnTaskId: string;
  bpmnTaskName: string;
  fieldContents: FieldContentMap;
  instanceDetails: InstanceDetails;
  instances: IServiceTaskInstances;
  processes: IServiceTaskProcesses;
  roxApi: IServiceTaskRoxApi;
  mailer: IServiceTaskMailer;
  workspace: WorkspaceDetails;
  sender: UserDetails;
  fileStore: IFileStore;
  serverConfig: IConfig;
}

export async function getFields(environment: ServiceTaskEnvironment) {
  const processObject: BpmnProcess = new BpmnProcess();
  await processObject.loadXml(environment.bpmnXml);
  const taskObject = processObject.getExistingTask(processObject.processId(), environment.bpmnTaskId);
  const extensionValues = BpmnProcess.getExtensionValues(taskObject);
  const config = extensionValues.serviceTaskConfigObject;

  return config.fields;
}
