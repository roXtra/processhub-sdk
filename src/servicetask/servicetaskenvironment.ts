import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { FieldContentMap } from "../data/datainterfaces";
import { IFileStore } from "../filestore";
import { IConfig } from "../serverconfig";
import { BpmnProcess, ProcessExtras, ProcessDetails } from "../process";
import { SendMailTemplateRequest, SendMailTemplateReply } from "../mailer/mailerinterfaces";

/**
 * instance methods that ServiceTasks can use
 */
export interface IServiceTaskInstances {
  updateInstance(instanceDetails: InstanceDetails): Promise<InstanceDetails>;
  uploadAttachment(processId: string, instanceId: string, fileName: string, dataBase64: string): Promise<string>;
  generateInstanceReport(instanceIdStrings: string, draftId: string, type: "docx" | "pdf"): Promise<{ doc: Buffer, fileName: string }>;
  executeInstance(processId: string, instance: InstanceDetails, startEventId?: string): Promise<string>;
}

/**
 * mailer methods that ServiceTasks can use
 */
export interface IServiceTaskMailer {
  sendMailTemplate(request: SendMailTemplateRequest): Promise<SendMailTemplateReply>;
}

/**
 * process methods that SericeTasks can user
 */
export interface IServiceTaskProcesses {
  getProcessDetails(processId: string, extras: ProcessExtras): Promise<ProcessDetails>;
}

export interface ServiceTaskEnvironment {
  bpmnXml: string;
  bpmnTaskId: string;
  bpmnTaskName: string;
  fieldContents: FieldContentMap;
  instanceDetails: InstanceDetails;
  instances: IServiceTaskInstances;
  processes: IServiceTaskProcesses;
  mailer: IServiceTaskMailer;
  workspace: WorkspaceDetails;
  sender: UserDetails;
  fileStore: IFileStore;
  serverConfig: IConfig;
}

export async function getFields(environment: ServiceTaskEnvironment) {
  let processObject: BpmnProcess = new BpmnProcess();
  await processObject.loadXml(environment.bpmnXml);
  let taskObject = processObject.getExistingTask(processObject.processId(), environment.bpmnTaskId);
  let extensionValues = BpmnProcess.getExtensionValues(taskObject);
  let config = extensionValues.serviceTaskConfigObject;

  return config.fields;
}
