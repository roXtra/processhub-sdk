export interface IConfig {
  Redis: IRedisConfig;
  Database: IDatabaseConfig;
  Filestore: IFilestoreConfig;
  roXtra: IRoxtraConfig;
  Mailer: IMailerConfig;
  Mailbox: IMailboxConfig;
  Webserver: IWebserverConfig;
  ClientSettings: IClientSettingsConfig;
  Engine: IEngineConfig;
  Features: IFeatureConfig;
}

export interface IEngineConfig {
  sleepBeforeEnd: number;
}

export interface IRoxtraConfig {
  efApiEndpoint: string;
  url: string;
  clientSecret: string;
}

export interface IRedisConfig {
  serverHost: string;
  devServerHost: string;
  redisHost: string;
  devRedisHost: string;
  awsApiGatewayEndpoint: string;
  awsApiGatewayKey: string;
}

export interface IDatabaseConfig {
  connection: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface IFilestoreConfig {
  baseDir?: string;
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