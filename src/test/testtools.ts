import { IServiceTaskEnvironment } from "../servicetask/servicetaskenvironment.js";
import { PREVIEW_FILENAME } from "../filestore/ifilestore.js";
import { ISendMailTemplateReply } from "../mailer/mailerinterfaces.js";
import { IProcessDetails } from "../process/processinterfaces.js";
import { IWorkspaceDetails, WorkspaceRole } from "../workspace/workspaceinterfaces.js";
import { IInstanceDetails } from "../instance/instanceinterfaces.js";
import { emptyUser, IUserDetails } from "../user/userinterfaces.js";
import { IUserFieldsConfig } from "../config.js";

export const testUserFieldsConfig: IUserFieldsConfig = {
  fields: [
    {
      caption: "Anrede",
      fieldvalueswithcaption: [
        { caption: "Herr", rawcaption: "[14972]Herr", value: "Herr" },
        { caption: "Herr Dr.", rawcaption: "[14973]Herr Dr.", value: "Herr Dr." },
        { caption: "Herr Prof.", rawcaption: "[14974]Herr Prof.", value: "Herr Prof." },
        { caption: "Frau", rawcaption: "[14975]Frau", value: "Frau" },
        { caption: "Frau Dr.", rawcaption: "[14976]Frau Dr.", value: "Frau Dr." },
        { caption: "Frau Prof.", rawcaption: "[14977]Frau Prof.", value: "Frau Prof." },
      ],
      id: "Salutation",
      rawcaption: "[15088]Anrede",
      type: "select",
    },
    { caption: "Adresse 1", id: "Address1", rawcaption: "[15098]Adresse 1", type: "string" },
    { caption: "Startordner-ID", id: "FolderID", rawcaption: "[15105]Startordner-ID", type: "int" },
  ],
};

export const testUserFieldsConfigEn: IUserFieldsConfig = {
  fields: [
    {
      caption: "Salutation",
      fieldvalueswithcaption: [
        { caption: "Mr.", rawcaption: "[14972]Herr", value: "Herr" },
        { caption: "Dr.", rawcaption: "[14973]Herr Dr.", value: "Herr Dr." },
        { caption: "Prof.", rawcaption: "[14974]Herr Prof.", value: "Herr Prof." },
        { caption: "Ms.", rawcaption: "[14975]Frau", value: "Frau" },
        { caption: "Dr.", rawcaption: "[14976]Frau Dr.", value: "Frau Dr." },
        { caption: "Prof.", rawcaption: "[14977]Frau Prof.", value: "Frau Prof." },
      ],
      id: "Salutation",
      rawcaption: "[15088]Anrede",
      type: "select",
    },
    { caption: "Address 1", id: "Address1", rawcaption: "[15098]Adresse 1", type: "string" },
    { caption: "Address 2", id: "Address2", rawcaption: "[15099]Adresse 2", type: "string" },
    { caption: "Location", id: "City", rawcaption: "[15100]Stadt", type: "string" },
    { caption: "State", id: "State", rawcaption: "[15101]Staat", type: "string" },
    { caption: "Start folder ID", id: "FolderID", rawcaption: "[15105]Startordner-ID", type: "int" },
  ],
};

export function createEmptyTestServiceEnvironment(bpmnXml: string): IServiceTaskEnvironment {
  return {
    roXtraBaseUrl: "http://localhost/roxtra/",
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
      getEfApiEndpoint: (): string => {
        return "https://localhost/roxtra/api/roxefapi.svc/eforms/";
      },
      getApiToken: (): string => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      getEfApiToken: async (): Promise<string> => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      getAccessTokenFromAuth: async (): Promise<string> => {
        throw new Error("Not implemented");
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      getSupervisor: async (): Promise<{ type: "group" | "user" | "error"; value: string | number }> => {
        throw new Error("Not implemented");
      },
      getUsersConfig: () => Promise.resolve(testUserFieldsConfig),
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
        port: undefined,
      },
      Filestore: {
        baseDir: "c:\\Roxtra\\doc\\eformulare",
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
        maxUploadSizeInMB: 300,
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
    getVM: () => ({
      init: () => Promise.resolve(),
      evalCode: () => undefined,
      setGlobal: () => undefined,
      getGlobal: () => undefined,
      [Symbol.dispose]: () => undefined,
    }),
  };
}
