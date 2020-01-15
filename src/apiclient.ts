import "fetch-everywhere";
import * as Api from "./legacyapi";
import { IFieldContentMap } from "./data";
import { createId } from "./tools";
import { IInstanceDetails } from "./instance";
import { IExecuteReply, ProcessEngineApiRoutes } from "./instance/legacyapi";

export class ApiClient {
  private accessToken: string;

  constructor(apiHost = "https://app.processhub.com", accessToken?: string) {
    this.accessToken = accessToken;
  }

  async startProcess(workspaceId: string, processId: string, fieldContents?: IFieldContentMap): Promise<string> {
    const instance: IInstanceDetails = {
      instanceId: createId(),
      workspaceId: workspaceId,
      processId: processId,
      extras: {
        instanceState: null,
        roleOwners: {},
        fieldContents: fieldContents
      }
    };

    const response: IExecuteReply = await Api.postJson(ProcessEngineApiRoutes.execute, {
      processId: processId,
      instance: instance
    }, this.accessToken);

    return response.instanceId;
  }
}
