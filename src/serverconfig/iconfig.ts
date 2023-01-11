/**
 * IMPORTANT: When adding/changing entries here,
 * entries must also be adjusted in the Setup project
 */
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
    updateAllInstances: string;
    migrateStatisticReportDrafts: string;
    updateAuditMetrics: string;
  };
}

export interface IRoxtraConfig {
  efApiEndpoint: string;
  url: string;
  clientSecret: string;
}

export interface IDatabaseConfig {
  connection: string;
  user: string;
  password: string;
  database: string;
  encrypt: boolean;
  poolSize: number;
}

export interface IFilestoreConfig {
  baseDir: string;
}

/**
 * MailboxConfig: requires either password or appId + tenantId + secret (OAuth2)
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

export interface IMailerConfig {
  senderName: string;
  senderMail: string;
  smtpPort: number;
  smtpServer: string;
  smtpUser: string;
  smtpPassword: string;
  requireTls: boolean;
}

export interface IWebserverConfig {
  port: number;
  baseUrl: string;
  isTestServer?: boolean;
}

export interface IClientSettingsConfig {
  statistics: IStatisticsConfig;
  extendedErrorMessages: boolean;
  eformVersion: string;
}

export interface IStatisticsConfig {
  enabled: boolean;
  tabs: ITabConfig[];
}

export interface ITabConfig {
  name: string;
}

export interface IFeatureConfig {
  features: IFeatureFlag[];
}

export interface IFeatureFlag {
  feature: string;
  enabled: boolean;
}

export interface ITlsConfig {
  rejectUnauthorized: boolean;
}

export interface ISettingsFile {
  settings: {
    BaseURL: string;
  };
}
