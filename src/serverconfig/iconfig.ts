/**
 * IMPORTANT: When adding/changing entries here,
 * entries must also be adjusted in the Setup project
 */

import { AiCompletionProviders } from "./aiprovider.js";

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareConfig.cs !!!!
export interface IConfig {
  Database: IDatabaseConfig;
  Filestore: IFilestoreConfig;
  Mailer: IMailerConfig;
  Mailbox: IMailboxConfig;
  Webserver: IWebserverConfig;
  ClientSettings: IClientSettingsConfig;
  Features: IFeatureConfig;
  Tls: ITlsConfig;
  Migration: {
    // !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareMigrationConfig.cs !!!!
    updateAllInstances: string;
    migrateStatisticReportDrafts: string;
    updateAuditMetrics: string;
  };
  AiCompletion: IAiCompletionConfig;
  GrpcSettings: IGrpcSettingsConfig;
  AiOptions: IAiOptionsConfig;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareDatabaseConfig.cs !!!!
export interface IDatabaseConfig {
  connection: string;
  user: string;
  password: string;
  database: string;
  encrypt: boolean;
  poolSize: number;
  port: number | undefined;
  requestTimeout?: number;
  transactionTimeout?: number;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareFilestoreConfig.cs !!!!
export interface IFilestoreConfig {
  baseDir: string;
}

/**
 * MailboxConfig: requires either password or appId + tenantId + secret (OAuth2)
 * !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareMailboxConfig.cs !!!!
 */
export interface IMailboxConfig {
  mail: string;
  user: string;
  /** Required for Authentication without OAuth2 */
  password: string | undefined;
  host: string;
  port: number;
  tls: boolean;
  reconnectTime: number;
  /** Required for OAuth2-Authentication */
  appId: string | undefined;
  /** Required for OAuth2-Authentication */
  tenantId: string | undefined;
  /** Required for OAuth2-Authentication */
  secret: string | undefined;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareMailerConfig.cs !!!!
export interface IMailerConfig {
  senderName: string;
  senderMail: string;
  smtpPort: number;
  smtpServer: string;
  smtpUser: string;
  smtpPassword: string;
  requireTls: boolean;
  OAuth2Config?: {
    AppId: string;
    TenantId: string;
    ClientSecret: string;
  };
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareWebserverConfig.cs !!!!
export interface IWebserverConfig {
  port: number;
  baseUrl: string;
  isTestServer?: boolean;
  maxUploadSizeInMB: number;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareClientSettingsConfig.cs !!!!
export interface IClientSettingsConfig {
  statistics: IStatisticsConfig;
  extendedErrorMessages: boolean;
  eformVersion: string;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareClientSettingsStatisticsConfig.cs !!!!
export interface IStatisticsConfig {
  enabled: boolean;
  tabs: ITabConfig[];
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareClientSettingsStatisticsTabConfig.cs !!!!
export interface ITabConfig {
  name: string;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareAiCompletionConfig.cs !!!!
export interface IAiCompletionConfig {
  completionProvider: AiCompletionProviders;
  apiKey: string;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareGrpcSettingsConfig.cs !!!!
export interface IGrpcSettingsConfig {
  port: number;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareFeatureConfig.cs !!!!
export interface IFeatureConfig {
  features: IFeatureFlag[];
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareFeatureFlagConfig.cs !!!!
export interface IFeatureFlag {
  feature: string;
  enabled: boolean;
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EFormulareTlsConfig.cs !!!!
export interface ITlsConfig {
  rejectUnauthorized: boolean;
}

// This interface may only include properties that are defined in the Roxtra.Standard.Config package!
export interface ISettingsFile {
  settings: {
    BaseURL: string;
    TestServer?: {
      Enabled: boolean;
    };
    User: {
      AuditTrailDisplayNamePattern: string;
    };
  };
}

export interface IAuthSettingsFile {
  auth: {
    Applications: {
      efApi: {
        ClientSecret: string;
      };
    };
  };
}

// !!!! Changes must also be made to Roxtra.Standard.Config/Eformulare/EformulareAiOptionsConfig.cs !!!!
export interface IAiOptionsConfig {
  RoxtraAiApiKey?: string;
  AiProvider?: string;
  AiServiceGrpcEndpoint?: string;
}
