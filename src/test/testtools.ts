import { ServiceTaskEnvironment } from "../servicetask/servicetaskenvironment";
import { PREVIEW_FILENAME } from "../filestore/ifilestore";

export function createEmptyTestServiceEnvironment(bpmnXml: string): ServiceTaskEnvironment {

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
      getApiToken: () => undefined,
      getEfApiToken: async () => undefined,
    },
    workspace: undefined,
    sender: undefined,
    instances: {
      updateInstance: async (i) => i,
      uploadAttachment: async () => undefined,
      generateInstanceReport: async () => undefined,
      executeInstance: async () => undefined,
    },
    mailer: {
      sendMailTemplate: () => undefined,
    },
    processes: {
      getProcessDetails: () => undefined,
    },
    fileStore: {
      getAttachmentFileUrl: () => "",
      getFile: async () => "",
      getFileBuffer: async () => new Buffer(""),
      getPreviewFileUrl: () => PREVIEW_FILENAME,
      createFile: async () => true,
      createPreviewFile: async () => true,
      createProfilePicture: async () => "",
      deleteFile: async () => true,
      deleteProcessFile: async () => true,
      deleteProcessFolder: async () => true,
      deleteWorkspaceFolder: async () => true,
      listObjects: async () => [],
      exists: async () => false,
      getLastModifiedDate: async () => new Date(),
      getPhysicalPath: () => "",
      getDownloadRoute: () => undefined,
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
    }
  };
}
