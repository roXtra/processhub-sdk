import fs = require("fs");
import { FieldContentMap } from "../data/datainterfaces";
import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { ServiceTaskEnvironment } from "../servicetask/servicetaskenvironment";

export async function readFileAsync(fileName: string): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function createEmptyTestServiceEnvironment(bpmnXmlPath: string): ServiceTaskEnvironment{

  return {
    bpmnXml: fs.readFileSync(bpmnXmlPath, "utf8"),
    bpmnTaskId: "",
    bpmnTaskName: "",
    fieldContents: {},
    instanceDetails: {
      instanceId: "",
      workspaceId: "",
      processId: "",
      extras: { fieldContents: {} },
    },
    workspace: undefined,
    sender: undefined,
    accessToken: "",
    fileStore: undefined
  };
}
