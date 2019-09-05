export interface IConfig {
    Redis: RedisConfig;
    Database: DatabaseConfig;
    Filestore: FilestoreConfig;
    roXtra: RoxtraConfig;
    Mailer: MailerConfig;
    Mailbox: MailboxConfig;
    Webserver: WebserverConfig;
    ClientSettings: ClientSettingsConfig;
    Engine: EngineConfig;
  }

  export interface EngineConfig {
    sleepBeforeEnd: number;
  }
  
  export interface RoxtraConfig {
    efApiEndpoint: string;
    url: string;
    clientSecret: string;
  }
  
  export interface RedisConfig {
    serverHost: string;
    devServerHost: string;
    redisHost: string;
    devRedisHost: string;
    awsApiGatewayEndpoint: string;
    awsApiGatewayKey: string;
  }
  
  export interface DatabaseConfig {
    connection: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }
  
  export interface FilestoreConfig {
    baseDir?: string;
  }
  
  export interface MailboxConfig {
    mail: string;
    user: string;
    password: string;
    host: string;
    port: number; 
    tls: boolean; 
    reconnectTime: number;
  }
  
  export interface MailerConfig {
    senderName: string;
    senderMail: string;
    smtpPort: number;
    smtpServer: string;
    smtpUser: string;
    smtpPassword: string;
    requireTls: boolean;
  }
  
  export interface WebserverConfig {
    port: number;
    baseUrl: string;
    tls: boolean;
    pfxFile: string;
    certificatePassword: string;
    isTestServer?: boolean;
  }
  
  export interface ClientSettingsConfig {
    statistics: StatisticsConfig;
    extendedErrorMessages: boolean;
  }
  
  export interface StatisticsConfig {
    enabled: boolean;
    tabs: TabConfig[];
  }
  
  export interface TabConfig {
    name: string;
  }