import { ISVNApi } from "./iapi";
import * as Utils from "./apiutils";
import { AuthApi } from "./authapi";
import { RoxtraLicenseOrder } from "./apitypes";
import { ApiResult } from "../legacyapi";

export class SVNApi implements ISVNApi {
  private baseURL: string;
  private token: string;
  private error: boolean;

  private constructor(baseURL: string) {
    this.token = "";
    this.baseURL = baseURL;
    this.error = false;
  }

  public static async connect(baseURL: string, clientID: string, clientSecret: string): Promise<SVNApi> {
    const instance: SVNApi = new SVNApi(baseURL);

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

  public async getLicense(customerNumber: string): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/svn/customerlicense/" + customerNumber;

    return await Utils.get(apiURL, this.token);
  }

  public async updateLicense(customerNumber: string, licenseOrder: RoxtraLicenseOrder): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/svn/processlicenseorder/" + customerNumber;
    return await Utils.post(apiURL, this.token, licenseOrder);
  }
}