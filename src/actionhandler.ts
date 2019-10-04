import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras } from "./user/userinterfaces";
import * as Assert from "./tools/assert";
import { ApiClient } from "./apiclient";
import { CoreEnvironment } from "./environment";


export interface ExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export class ActionHandler extends ApiClient {

  constructor(apiHost = "https://app.processhub.com", accessToken?: string) {
    super(apiHost, accessToken);
  }

  // Load Page "/@workspace/..."
  gotoPage(_path: string): void {
    // TypeScript requires that all functions in classes are defined. We throw an assertion for
    // functions that must be overridden in derived ActionHandlers
    Assert.error();
  }

  requestExtras(_environment: CoreEnvironment, _requestedExtras: ExtrasRequest, _forceReload?: boolean): Promise<void> {
    throw new Error("Method not implemented.");
  }

  openInstancePopup(_workspaceId: string, _instanceId: string): void {
    Assert.error();
  }

  openAccountPopup(): void {
    Assert.error();
  }

  closeInstancePopup(): void {
    Assert.error();
  }
}
