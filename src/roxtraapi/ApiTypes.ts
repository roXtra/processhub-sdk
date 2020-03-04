export type AuthRequestBody = {
  ClientId: string;
  ClientSecret: string;
};

export type CRMCustomer = {
  crmCompanyGuid: string;
  crmCompanyNumber: string;
  crmCompanyName: string;
  crmLicense: any;
  svnCompanyName: string;
  crmCompanyContact: CRMContact[];
};

export type CRMNoteRequestBody = {
  title: string;
  message: string;
};

export type CRMContact = {
  id: string;
  salutation: string;
  firstname: string;
  lastname: string;
  email: string;
  language: string;
};

export type RoxtraLicenseOrder = {
  orderNumber: string;
  orderedLicenses: LicenseEntry[];
};

export type LicenseEntry = {
  licenceType: LicenseType;
  licenceCount: number;
  limited: boolean;
  timeLimitValue: Date;
};

export type LicenseCommit = {
  commitMessage: string;
  licenseData: string; // Base64 encoded
  error: boolean;
};

export type IRoxtraCustomReceiver = {
  Name: string;
  Email: string;
};

export type IRoxtraCustomMailAttachment = {
  Filename: string;
  Base64Content: string; // Base64 encoded
};

export type IRoxtraCustomMailMessage = {
  Subject: string;
  BodyHtml: string;
  BodyText: string;
  Receivers: IRoxtraCustomReceiver[];
  Attachements: IRoxtraCustomMailAttachment[];
  Importance: number;
};

/* eslint-disable camelcase, @typescript-eslint/camelcase*/
export enum LicenseType {
  none,

  //
  Enterprise,
  Pro,

  // Licences
  Writer,
  Reader,
  PublicReader,
  Graph,
  eFormulare,
  Risikomanagement,

  // Services
  CDBuilder,
  API,
  ADSI,
  Previewserver,
  Indexserver,
  DOC,

  // ???
  Customer,
  Multisession,

  // Sprachen
  Language_Englisch,
  Language_Chinesisch,
  Language_Chinesisch_HongKong,
  Language_Chinesisch_Kantonesisch,
  Language_Deutsch,
  Language_Tschechisch,
  Language_Italienisch,
  Language_Spanisch,
  Language_Fransösisch,
  Language_Türkisch,
  Language_Niederländisch,
  Language_Ungarisch,
  Language_Portugiesisch,
  Language_Kroatisch,
  Language_Polnisch,
  Language_Russisch,
  Language_Serbisch_Lateinisch,
  Language_Vietnamesisch,
  Language_Brasilianisch,
}
/* eslint-enable camelcase, @typescript-eslint/camelcase*/

export const moduleMapping: { [key: string]: number } = {
  "e-Formulare": LicenseType.eFormulare,
  "CD-Builder": LicenseType.CDBuilder,
  "API": LicenseType.API,
  "IDP": LicenseType.ADSI,
};

export const moduleNameMapping: { [key: string]: string } = {
  "e-Formulare": "e-Formulare",
  "CD-Builder": "CD-Builder",
  "API": "API",
  "ADSI": "IDP",
};

export const languageShortNameMapping: { [key: string]: number } = {
  "en-US": LicenseType.Language_Englisch,
  "es-ES": LicenseType.Language_Spanisch,
  "fr-FR": LicenseType.Language_Fransösisch,
  "it-IT": LicenseType.Language_Italienisch,
  "zh-CN": LicenseType.Language_Chinesisch,
  "zh-HK": LicenseType.Language_Chinesisch_HongKong,
  "tr-TR": LicenseType.Language_Türkisch,
  "de-DE": LicenseType.Language_Deutsch,
  "nl-NL": LicenseType.Language_Niederländisch,
  "hu-HU": LicenseType.Language_Ungarisch,
  "cs-CZ": LicenseType.Language_Tschechisch,
  "pt-PT": LicenseType.Language_Portugiesisch,
  "pt-BR": LicenseType.Language_Brasilianisch,
  "hr-HR": LicenseType.Language_Kroatisch,
  "pl-PL": LicenseType.Language_Polnisch,
  "ru-RU": LicenseType.Language_Russisch,
  "sr-Latn": LicenseType.Language_Serbisch_Lateinisch,
  "vi-VN": LicenseType.Language_Vietnamesisch,
};

export const languageLongNameMapping: { [key: string]: number } = {
  "Englisch": LicenseType.Language_Englisch,
  "Spanisch": LicenseType.Language_Spanisch,
  "Französisch": LicenseType.Language_Fransösisch,
  "Italienisch": LicenseType.Language_Italienisch,
  "Chinesisch": LicenseType.Language_Chinesisch,
  "Chinesisch (Hong Kong)": LicenseType.Language_Chinesisch_HongKong,
  "Türkisch": LicenseType.Language_Türkisch,
  "Deutsch": LicenseType.Language_Deutsch,
  "Niederländisch": LicenseType.Language_Niederländisch,
  "Ungarisch": LicenseType.Language_Ungarisch,
  "Tschechisch": LicenseType.Language_Tschechisch,
  "Portugiesisch": LicenseType.Language_Portugiesisch,
  "Portugiesisch (Brasilianisch)": LicenseType.Language_Brasilianisch,
  "Kroatisch": LicenseType.Language_Kroatisch,
  "Polnisch": LicenseType.Language_Polnisch,
  "Russisch": LicenseType.Language_Russisch,
  "Serbisch (Lateinisch)": LicenseType.Language_Serbisch_Lateinisch,
  "Vietnamesisch": LicenseType.Language_Vietnamesisch,
};
