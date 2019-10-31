import { IServiceTaskEnvironment } from "../servicetask/servicetaskenvironment";
import { PREVIEW_FILENAME } from "../filestore/ifilestore";
import { IInstanceDetails } from "../instance";
import { ISendMailTemplateReply } from "../mailer/mailerinterfaces";
import { IProcessDetails } from "../process/processinterfaces";
import { ServerRoute } from "hapi";

export function createEmptyTestServiceEnvironment(bpmnXml: string): IServiceTaskEnvironment {

  return {
    bpmnXml,
    bpmnTaskId: "",
    bpmnTaskName: "",
    /**
     * @deprecated use instanceDetails.extras.fieldContents
     */
    fieldContents: {},
    instanceDetails: {
      instanceId: "",
      workspaceId: "",
      processId: "",
      extras: {
        instanceState: null,
        fieldContents: {}
      },
    },
    roxApi: {
      getApiToken: (): string => undefined,
      // eslint-disable-next-line @typescript-eslint/require-await
      getEfApiToken: async (): Promise<string> => undefined,
      // eslint-disable-next-line @typescript-eslint/require-await
      getRoxtraTokenByUserId: async (): Promise<string> => undefined,
    },
    workspace: undefined,
    sender: undefined,
    instances: {
      // eslint-disable-next-line @typescript-eslint/require-await
      updateInstance: async (i): Promise<IInstanceDetails> => i,
      // eslint-disable-next-line @typescript-eslint/require-await
      uploadAttachment: async (): Promise<string> => undefined,
      // eslint-disable-next-line @typescript-eslint/require-await
      generateInstanceReport: async (): Promise<{ doc: Buffer; fileName: string }> => undefined,
      // eslint-disable-next-line @typescript-eslint/require-await
      executeInstance: async (): Promise<string> => undefined,
    },
    mailer: {
      sendMailTemplate: (): Promise<ISendMailTemplateReply> => undefined,
    },
    processes: {
      getProcessDetails: (): Promise<IProcessDetails> => undefined,
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
      getDownloadRoute: (): ServerRoute => undefined,
    },
    serverConfig: {
      Database: {
        connection: "localhost",
        port: 1473,
        user: "EFormulare",
        password: "",
        database: "EFormulare"
      },
      Engine: {
        sleepBeforeEnd: 0
      },
      Filestore: {
        baseDir: "c:\\Roxtra\\doc\\eformulare"
      },
      roXtra: {
        efApiEndpoint: "https://localhost/Roxtra/api/roxefapi.svc/eforms/",
        url: "http://localhost/Roxtra/",
        clientSecret: "@@roxApiClients.ClientSecret@@"
      },
      Mailbox: {
        reconnectTime: 3600000,
        mail: "mailbox@localhost.local",
        user: "mailbox@localhost.local",
        password: "",
        host: "127.0.0.1",
        port: 143,
        tls: true,
      },
      Mailer: {
        senderName: "roXtra-Server",
        senderMail: "no-reply@roxtra.com",
        smtpPort: 25,
        smtpServer: "127.0.0.1",
        smtpUser: "send@localhost.local",
        smtpPassword: "",
        requireTls: true
      },
      Redis: {
        serverHost: "",
        devRedisHost: "",
        devServerHost: "",
        redisHost: "localhost",
        awsApiGatewayEndpoint: "",
        awsApiGatewayKey: "",
      },
      Webserver: {
        port: 8397,
        baseUrl: "http://localhost:5051",
        tls: false,
        pfxFile: "",
        certificatePassword: "",
      },
      ClientSettings: {
        extendedErrorMessages: true,
        statistics: {
          enabled: true,
          tabs: [
            {
              name: "reports"
            },
            {
              name: "heatmaps"
            },
            {
              name: "table"
            }
          ]
        }
      },
      Features: {
        features: [],
      },
    }
  };
}
