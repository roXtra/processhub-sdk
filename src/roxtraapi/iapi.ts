import { RoxtraLicenseOrder, IRoxtraCustomMailMessage, CRMNoteRequestBody } from "./apitypes";

export interface IAuthApi {
  authenticate(baseURL: string, clientID: string, clientSecret: string): Promise<Response>;
}

export interface ICRMApi {
  loadCRMCustomer(customerNumber: string): Promise<Response>;
  getLicenseMailContacts(customerNumber: string): Promise<Response>;
  getVoucher(orderNumber: string): Promise<Response>;
  addCRMNote(companyID: string, body: CRMNoteRequestBody): Promise<Response>;
  syncCRMLicense(companyID: string): Promise<Response>;
}

export interface ISVNApi {
  getLicense(customerNumber: string): Promise<Response>;
  updateLicense(customerNumber: string, licenseOrder: RoxtraLicenseOrder): Promise<Response>;
}

export interface IMailApi {
  sendMail(body: IRoxtraCustomMailMessage): Promise<Response>;
}