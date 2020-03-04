import { ICRMApi } from "./IApi";
import { AuthApi } from "./AuthApi";
import { CRMNoteRequestBody } from "./ApiTypes";
import * as Utils from "./APIUtils";
import { ApiResult } from "../legacyapi";

export class CRMApi implements ICRMApi {
  private baseURL: string;
  private token: string;
  private error: boolean;

  private constructor(baseURL: string) {
    this.token = "";
    this.baseURL = baseURL;
    this.error = false;
  }

  public static async connect(baseURL: string, clientID: string, clientSecret: string): Promise<CRMApi> {
    const instance: CRMApi = new CRMApi(baseURL);

    const res = await new AuthApi().authenticate(baseURL, clientID, clientSecret);
    if (res && res.status === ApiResult.API_OK) {
      instance.token = await res.text();
    } else {
      instance.error = true;
    }
    return instance;
  }

  public hasError(): boolean {
    return this.error;
  }

  public async loadCRMCustomer(customerNumber: string): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/crm/customer_n/" + customerNumber;

    return await Utils.get(apiURL, this.token);
  }

  public async getLicenseMailContacts(customerId: string): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/crm/licensecontacts/" + customerId;

    return await Utils.get(apiURL, this.token);
  }

  public async getVoucher(orderNumber: string): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/crm/voucher/" + orderNumber;

    return await Utils.get(apiURL, this.token);
  }

  public async addCRMNote(companyID: string, body: CRMNoteRequestBody): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/crm/note/" + companyID;

    return await Utils.post(apiURL, this.token, body);
  }

  public async syncCRMLicense(companyID: string): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/crm/synclicense/" + companyID;

    return await Utils.post(apiURL, this.token, {});
  }
}