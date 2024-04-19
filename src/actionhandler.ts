import { WorkspaceExtras } from "./workspace/workspaceinterfaces.js";
import { ProcessExtras } from "./process/processinterfaces.js";
import { InstanceExtras } from "./instance/instanceinterfaces.js";
import { UserExtras } from "./user/userinterfaces.js";

export interface IExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: { extras: ProcessExtras; registerId: string };
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export abstract class ActionHandler {
  // Load Page "/@workspace/..."
  public abstract gotoPage(path: string): void;
  public abstract requestExtras(requestedExtras: IExtrasRequest, forceReload?: boolean): Promise<void>;
  public abstract openInstancePopup(workspaceId: string, processId: string, instanceId: string, todoId: string | undefined, readonly: boolean): Promise<void>;
  public abstract openTodoPopup(workspaceId: string, processId: string, instanceId: string, todoId: string): Promise<void>;
}
