/**
 * IMPORTANT: When adding/changing entries here,
 * entries must also be adjusted in the Setup project
 */

import { AiCompletionProviders } from "./aiprovider";

// !!!! Changes must also be made to Setup/Config/EFormulareConfig.cs !!!!
export interface IConfig {
  Database: IDatabaseConfig;
  Filestore: IFilestoreConfig;
  roXtra: IRoxtraConfig;
  Mailer: IMailerConfig;
  Mailbox: IMailboxConfig;
  Webserver: IWebserverConfig;
  ClientSettings: IClientSettingsConfig;
  Features: IFeatureConfig;
  Tls: ITlsConfig;
  Migration: {
    // !!!! Changes must also be made to Setup/Config/EFormulareMigrationConfig.cs !!!!
    updateAllInstances: string;
    migrateStatisticReportDrafts: string;
    updateAuditMetrics: string;
  };
  AiCompletion: IAiCompletionConfig;
  GrpcSettings: IGrpcSettingsConfig;
}

// !!!! Changes must also be made to Setup/Config/EFormulareRoxtraConfig.cs !!!!
export interface IRoxtraConfig {
  efApiEndpoint: string;
  url: string;
  clientSecret: string;
}

// !!!! Changes must also be made to Setup/Config/EFormulareDatabaseConfig.cs !!!!
export interface IDatabaseConfig {
  connection: string;
  user: string;
  password: string;
  database: string;
  encrypt: boolean;
  poolSize: number;
  port: number | undefined;
}

// !!!! Changes must also be made to Setup/Config/EFormulareFilestoreConfig.cs !!!!
export interface IFilestoreConfig {
  baseDir: string;
}

/**
 * MailboxConfig: requires either password or appId + tenantId + secret (OAuth2)
 * !!!! Changes must also be made to Setup/Config/EFormulareMailboxConfig.cs !!!!
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

// !!!! Changes must also be made to Setup/Config/EFormulareMailerConfig.cs !!!!
export interface IMailerConfig {
  senderName: string;
  senderMail: string;
  smtpPort: number;
  smtpServer: string;
  smtpUser: string;
  smtpPassword: string;
  requireTls: boolean;
}

// !!!! Changes must also be made to Setup/Config/EFormulareWebserverConfig.cs !!!!
export interface IWebserverConfig {
  port: number;
  baseUrl: string;
  isTestServer?: boolean;
  maxUploadSizeInMB: number;
}

// !!!! Changes must also be made to Setup/Config/EFormulareClientSettingsConfig.cs !!!!
export interface IClientSettingsConfig {
  statistics: IStatisticsConfig;
  extendedErrorMessages: boolean;
  eformVersion: string;
}

// !!!! Changes must also be made to Setup/Config/EFormulareClientSettingsStatisticsConfig.cs !!!!
export interface IStatisticsConfig {
  enabled: boolean;
  tabs: ITabConfig[];
}

// !!!! Changes must also be made to Setup/Config/EFormulareClientSettingsStatisticsTabConfig.cs !!!!
export interface ITabConfig {
  name: string;
}

// !!!! Changes must also be made to Setup/Config/EFormulareAiCompletionConfig.cs !!!!
export interface IAiCompletionConfig {
  completionProvider: AiCompletionProviders;
  apiKey: string;
}

// !!!! Changes must also be made to Setup/Config/EFormulareGrpcSettingsConfig.cs !!!!
export interface IGrpcSettingsConfig {
  port: number;
}

// !!!! Changes must also be made to Setup/Config/EFormulareFeatureConfig.cs !!!!
export interface IFeatureConfig {
  features: IFeatureFlag[];
}

// !!!! Changes must also be made to Setup/Config/EFormulareFeatureFlagConfig.cs !!!!
export interface IFeatureFlag {
  feature: string;
  enabled: boolean;
}

// !!!! Changes must also be made to Setup/Config/EFormulareTlsConfig.cs !!!!
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
  };
}
