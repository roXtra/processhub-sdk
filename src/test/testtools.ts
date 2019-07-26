import { ServiceTaskEnvironment } from "../servicetask/servicetaskenvironment";

export function createEmptyTestServiceEnvironment(bpmnXml: string): ServiceTaskEnvironment {

  return {
    bpmnXml,
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
