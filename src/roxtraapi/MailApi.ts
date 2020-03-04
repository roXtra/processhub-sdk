import { IMailApi } from "./IApi";
import * as Utils from "./APIUtils";
import { AuthApi } from "./AuthApi";
import { IRoxtraCustomMailMessage } from "./ApiTypes";
import { ApiResult } from "../legacyapi";

export class MailApi implements IMailApi {
  private baseURL: string;
  private token: string;
  private error: boolean;

  private constructor(baseURL: string) {
    this.token = "";
    this.baseURL = baseURL;
    this.error = false;
  }

  public static async connect(baseURL: string, clientID: string, clientSecret: string): Promise<MailApi> {
    const instance: MailApi = new MailApi(baseURL);

    const res = await new AuthApi().authenticate(baseURL, clientID, clientSecret);
    if(res && res.status === ApiResult.API_OK) {
      instance.token = await res.text();
    } else {
      instance.error = true;
    }
    return instance;
  }

  public hasError(): boolean {
    return this.error;
  }

  public async sendMail(body: IRoxtraCustomMailMessage): Promise<Response> {
    const apiURL: string = this.baseURL + "/api/mailing/sendmail";
    console.log(body);
    return await Utils.post(apiURL, this.token, body);
  }
}