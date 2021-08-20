import { IExecuteRequest, IExecuteReply, IUploadAttachmentRequest, IUploadAttachmentReply } from "../instance/legacyapi";
import { IGetProcessDetailsRequest } from "../process/legacyapi";
import { IProcessDetails, IStartButtonMap } from "../process/processinterfaces";
import { ILoadUserReply, ILoadUserRequest } from "../user";
import { IWorkspaceDetails } from "../workspace";
import { ErrorCodes, IToken } from "./types";

export class API {
  private baseURL: string;
  private token: IToken | undefined;

  private constructor(baseURL?: string, token?: IToken) {
    if (baseURL) this.baseURL = baseURL;
    else this.baseURL = "http://localhost/Roxtra";

    if (token) this.token = token;
    else this.token = undefined;
  }

  public static async connect(baseURL: string, username: string, password: string): Promise<API> {
    const api = new API(baseURL);

    api.token = await api.authenticate(username, password);
    if (api.token.ErrorID) throw ErrorCodes.AUTHENTICATION_FAILED;

    return api;
  }

  public static connectWithToken(token: IToken): API {
    const api = new API(undefined, token);

    if (!api.token || api.token.ErrorID) throw ErrorCodes.TOKEN_INVALID;

    return api;
  }

  public getToken(): IToken | undefined {
    return this.token;
  }

  private async authenticate(name: string, password: string): Promise<IToken> {
    const promise = new Promise<IToken>((resolve, reject) => {
      const auth = Buffer.from(name + ":" + password, "utf-8").toString("base64");
      const xhr: XMLHttpRequest = this.getXMLHTTPRequest();
      xhr.open("GET", this.baseURL + "/api/roxApi.svc/rest/Authenticate");
      xhr.setRequestHeader("Authorization", "Basic " + auth);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.withCredentials = true;
      xhr.onload = () => {
        if (xhr.status === 200) {
          const res: IToken = JSON.parse(xhr.responseText);
          resolve(res);
        }

        if (xhr.status === 403) {
          reject(ErrorCodes.AUTHENTICATION_FAILED);
        }

        if (xhr.status === 512) {
          reject(ErrorCodes.TOKEN_INVALID);
        }
      };

      xhr.timeout = 20000;
      xhr.ontimeout = () => {
        reject(ErrorCodes.LOST_CONNECTION);
      };

      xhr.onerror = () => {
        if (xhr.status === 512) {
          reject(ErrorCodes.TOKEN_INVALID);
        }

        reject(ErrorCodes.SERVER_ERROR);
      };

      xhr.send();
    });

    return await promise;
  }

  public async getAreas(): Promise<IWorkspaceDetails[]> {
    const promise = new Promise<IWorkspaceDetails[]>((resolve, reject) => {
      if (this.token) {
        const xhr: XMLHttpRequest = this.getXMLHTTPRequest();
        xhr.open("POST", this.baseURL + "/modules/api/user/loaduser");
        xhr.setRequestHeader("authtoken", this.token.LoginToken);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res: ILoadUserReply = JSON.parse(xhr.responseText);
            if (res.userDetails) {
              const workspaces = res.userDetails.extras.workspaces;
              const sortedWorkspaces: IWorkspaceDetails[] = [];

              if (workspaces) {
                for (const workspace of workspaces) {
                  if (workspace.extras.processes) {
                    workspace.extras.processes = workspace.extras.processes.sort((a, b) => {
                      return a.displayName.localeCompare(b.displayName);
                    });
                    sortedWorkspaces.push(workspace);
                  }
                }
              }

              resolve(
                sortedWorkspaces.sort((a, b) => {
                  return a.displayName.localeCompare(b.displayName);
                }),
              );
            }
          }

          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.HTTP_ERROR);
        };

        xhr.timeout = 20000;
        xhr.ontimeout = () => {
          reject(ErrorCodes.LOST_CONNECTION);
        };

        xhr.onerror = () => {
          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.SERVER_ERROR);
        };

        const body: ILoadUserRequest = {
          getExtras: 2,
        };

        xhr.send(JSON.stringify(body));
      } else {
        reject("There is no Token set up. Unable to query API");
      }
    });

    return await promise;
  }

  public async getAllProcesses(): Promise<IProcessDetails[]> {
    const areas = await this.getAreas();
    const processes: IProcessDetails[] = areas
      .map((workspace: IWorkspaceDetails) => (workspace.extras.processes ? workspace.extras.processes : []))
      .reduce((result: IProcessDetails[], array: IProcessDetails[]) => {
        return (result = [...result, ...array]);
      });
    return processes;
  }

  public async getProcessDetails(body: IGetProcessDetailsRequest): Promise<IProcessDetails> {
    const promise = new Promise<IProcessDetails>((resolve, reject) => {
      if (this.token) {
        const xhr: XMLHttpRequest = this.getXMLHTTPRequest();
        xhr.open("GET", this.baseURL + `/modules/api/process/processdetails?processId=${body.processId}&getExtras=${body.getExtras as number}`);
        xhr.setRequestHeader("x-accesstoken", this.token.LoginToken);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            resolve(res.processDetails);
          }

          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.HTTP_ERROR);
        };

        xhr.timeout = 20000;
        xhr.ontimeout = () => {
          reject(ErrorCodes.LOST_CONNECTION);
        };

        xhr.onerror = () => {
          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.SERVER_ERROR);
        };

        xhr.send();
      } else {
        reject("There is no Token set up. Unable to query API");
      }
    });

    return await promise;
  }

  public getAllstartEvents(process: IProcessDetails): IStartButtonMap | undefined {
    const startEvents = process.userStartEvents;
    return startEvents;
  }

  public async execute(body: IExecuteRequest): Promise<IExecuteReply> {
    const promise = new Promise<IExecuteReply>((resolve, reject) => {
      if (this.token) {
        const xhr: XMLHttpRequest = this.getXMLHTTPRequest();
        xhr.open("POST", this.baseURL + "/modules/api/processengine/execute");
        xhr.setRequestHeader("x-accesstoken", this.token.LoginToken);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res: IExecuteReply = JSON.parse(xhr.responseText);
            resolve(res);
          }

          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.HTTP_ERROR);
        };

        xhr.timeout = 20000;
        xhr.ontimeout = () => {
          reject(ErrorCodes.LOST_CONNECTION);
        };

        xhr.onerror = () => {
          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.SERVER_ERROR);
        };

        xhr.send(JSON.stringify(body));
      } else {
        reject("There is no Token set up. Unable to query API");
      }
    });

    return await promise;
  }

  public async uploadAttachemnt(body: IUploadAttachmentRequest): Promise<IUploadAttachmentReply> {
    const promise = new Promise<IUploadAttachmentReply>((resolve, reject) => {
      if (this.token) {
        const xhr: XMLHttpRequest = this.getXMLHTTPRequest();
        xhr.open("POST", this.baseURL + "/Roxtra/modules/api/processengine/uploadattachment");
        xhr.setRequestHeader("x-accesstoken", this.token.LoginToken);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res: IUploadAttachmentReply = JSON.parse(xhr.responseText);
            resolve(res);
          }

          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.HTTP_ERROR);
        };

        xhr.timeout = 20000;
        xhr.ontimeout = () => {
          reject(ErrorCodes.LOST_CONNECTION);
        };

        xhr.onerror = () => {
          if (xhr.status === 512) {
            reject(ErrorCodes.TOKEN_INVALID);
          }

          reject(ErrorCodes.SERVER_ERROR);
        };

        xhr.send(JSON.stringify(body));
      } else {
        reject("There is no Token set up. Unable to query API");
      }
    });

    return await promise;
  }

  getXMLHTTPRequest(): XMLHttpRequest {
    if (typeof window === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return new XMLHttpRequest();
    } else {
      return new XMLHttpRequest();
    }
  }
}
