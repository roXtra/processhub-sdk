import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { FieldContentMap } from "../data/datainterfaces";
import { IFileStore } from "../filestore";
import {IConfig} from "../serverconfig"
import {BpmnProcess} from "../process"

export interface ServiceTaskEnvironment {
  bpmnXml: string;
  bpmnTaskId: string;
  bpmnTaskName: string;
  fieldContents: FieldContentMap;
  instanceDetails: InstanceDetails;
  workspace: WorkspaceDetails;
  sender: UserDetails;
  accessToken: string;
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
