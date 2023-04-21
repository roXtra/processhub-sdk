import { IServiceTaskEnvironment } from "../servicetask/servicetaskenvironment";
import { PREVIEW_FILENAME } from "../filestore/ifilestore";
import { ISendMailTemplateReply } from "../mailer/mailerinterfaces";
import { IProcessDetails } from "../process/processinterfaces";
import { IWorkspaceDetails, WorkspaceRole } from "../workspace/workspaceinterfaces";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { emptyUser, IUserDetails } from "../user/userinterfaces";

export function createEmptyTestServiceEnvironment(bpmnXml: string): IServiceTaskEnvironment {
  return {
    bpmnXml,
    bpmnTaskId: "",
    bpmnTaskName: "",
    fieldContents: {},
    instanceDetails: {
      title: "",
      instanceId: "",
      workspaceId: "",
      processId: "",
      takenStartEvent: "",
      reachedEndEvents: [],
      extras: {
        instanceState: undefined,
        fieldContents: {},
      },
    },
    roxApi: {
      getApiToken: (): string => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      getEfApiToken: async (): Promise<string> => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      getRoxtraTokenByUserId: async (): Promise<string> => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      getSupervisor: async (): Promise<{ type: "group" | "user" | "error"; value: string | number }> => {
        throw new Error("Not implemented");
      },
    },
    workspace: {
      workspaceId: "",
      displayName: "",
      userRole: WorkspaceRole.WorkspaceMember,
      extras: {},
      type: "backend",
    },
    sender: emptyUser,
    instances: {
      // eslint-disable-next-line @typescript-eslint/require-await
      updateInstance: async (i): Promise<IInstanceDetails> => i,
      // eslint-disable-next-line @typescript-eslint/require-await
      uploadAttachment: async (): Promise<string> => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      generateInstanceReport: async (): Promise<{ doc: string; fileName: string }> => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      executeInstance: async (): Promise<string> => {
        throw new Error("Not implemented");
      },
      getInstanceUrl: (): string => {
        throw new Error("Not implemented");
      },
    },
    mailer: {
      sendMailTemplate: (): Promise<ISendMailTemplateReply> => {
        throw new Error("Not implemented");
      },
    },
    processes: {
      getProcessDetails: (): Promise<IProcessDetails> => {
        throw new Error("Not implemented");
      },
    },
    workspaces: {
      getWorkspaceDetails: (): Promise<IWorkspaceDetails | undefined> => {
        throw new Error("Not implemented");
      },
    },
    users: {
      getUserDetails: (): Promise<IUserDetails | undefined> => {
        throw new Error("Not implemented");
      },
      getUserIdByMail: (): Promise<string | undefined> => {
        throw new Error("Not implemented");
      },
    },
    system: {
      setMaxBpmnEngineIterations: (count) => {
        // Dummy
      },
      setTransactionTimeout: async (timeout): Promise<void> => {
        // Dummy
      },
    },
    fileStore: {
      getAttachmentFileUrl: (): string => "",
      // eslint-disable-next-line @typescript-eslint/require-await
      getFile: async (): Promise<string> => "",
      // eslint-disable-next-line @typescript-eslint/require-await
      getFileBuffer: async (): Promise<Buffer> => Buffer.from(""),
      getPreviewFileUrl: (): string => PREVIEW_FILENAME,
      // eslint-disable-next-line @typescript-eslint/require-await
      createFile: async (): Promise<boolean> => true,
      // eslint-disable-next-line @typescript-eslint/require-await
      createPreviewFile: async (): Promise<boolean> => true,
      // eslint-disable-next-line @typescript-eslint/require-await
      createProfilePicture: async (): Promise<string> => "",
      // eslint-disable-next-line @typescript-eslint/require-await
      deleteFile: async (): Promise<boolean> => true,
      // eslint-disable-next-line @typescript-eslint/require-await
      deleteProcessFile: async (): Promise<boolean> => true,
      // eslint-disable-next-line @typescript-eslint/require-await
      deleteProcessFolder: async (): Promise<boolean> => true,
      // eslint-disable-next-line @typescript-eslint/require-await
      deleteWorkspaceFolder: async (): Promise<boolean> => true,
      // eslint-disable-next-line @typescript-eslint/require-await
      listObjects: async (): Promise<string[]> => [],
      // eslint-disable-next-line @typescript-eslint/require-await
      exists: async (): Promise<boolean> => false,
      // eslint-disable-next-line @typescript-eslint/require-await
      getLastModifiedDate: async (): Promise<Date> => new Date(),
      getPhysicalPath: (): string => "",
    },
    logger: {
      debug: (m) => console.debug(m),
      info: (m) => console.info(m),
      warn: (m) => console.warn(m),
      error: (m) => console.error(m),
      fatal: (m) => console.error(m),
    },
    serverConfig: {
      Database: {
        connection: "localhost",
        user: "EFormulare",
        password: "",
        database: "EFormulare",
        encrypt: true,
        poolSize: 300,
      },
      Filestore: {
        baseDir: "c:\\Roxtra\\doc\\eformulare",
      },
      roXtra: {
        efApiEndpoint: "https://localhost/Roxtra/api/roxefapi.svc/eforms/",
        url: "http://localhost/Roxtra/",
        clientSecret: "@@roxApiClients.ClientSecret@@",
      },
      Mailbox: {
        reconnectTime: 3600000,
        mail: "mailbox@localhost.local",
        user: "mailbox@localhost.local",
        password: "",
        host: "127.0.0.1",
        port: 143,
        tls: true,
        appId: "",
        tenantId: "",
        secret: "",
      },
      Mailer: {
        senderName: "roXtra-Server",
        senderMail: "no-reply@roxtra.com",
        smtpPort: 25,
        smtpServer: "127.0.0.1",
        smtpUser: "send@localhost.local",
        smtpPassword: "",
        requireTls: true,
      },
      Webserver: {
        port: 8397,
        baseUrl: "http://localhost:5051",
      },
      ClientSettings: {
        extendedErrorMessages: true,
        statistics: {
          enabled: true,
          tabs: [
            {
              name: "reports",
            },
            {
              name: "heatmaps",
            },
            {
              name: "table",
            },
          ],
        },
        eformVersion: "DEV",
      },
      Features: {
        features: [],
      },
      Tls: {
        rejectUnauthorized: true,
      },
      Migration: {
        updateAllInstances: "",
        migrateStatisticReportDrafts: "",
        updateAuditMetrics: "",
      },
      AiCompletion: {
        completionProvider: "",
        apiKey: "",
      },
      GrpcSettings: {
        port: 5000,
      },
    },
  };
}
