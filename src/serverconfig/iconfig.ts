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
  };
}

export interface IRoxtraConfig {
  efApiEndpoint: string;
  url: string;
  clientSecret: string;
}

export interface IDatabaseConfig {
  connection: string;
  port: number;
  user: string;
  password: string;
  database: string;
  encrypt: boolean;
}

export interface IFilestoreConfig {
  baseDir: string;
}

export interface IMailboxConfig {
  mail: string;
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  reconnectTime: number;
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
  tls: boolean;
  pfxFile: string;
  certificatePassword: string;
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
