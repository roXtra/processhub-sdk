import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { FieldContentMap } from "../data/datainterfaces";
import { IFileStore } from "../filestore";

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
}
