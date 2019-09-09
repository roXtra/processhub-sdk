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
    instances: {
      updateInstance: async (i) => i,
      uploadAttachment: async () => undefined,
      generateInstanceReport: async () => undefined,
    },
    mailer: {
      sendMailTemplate: () => undefined,
    },
    processes: {
      getProcessDetails: () => undefined,
    },
    fileStore: undefined,
    serverConfig: undefined
  };
}
