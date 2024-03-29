import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras } from "./user/userinterfaces";

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
