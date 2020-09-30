import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras } from "./user/userinterfaces";
import { ICoreEnvironment } from "./environment";

export interface IExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export abstract class ActionHandler {
  // Load Page "/@workspace/..."
  public abstract gotoPage(_path: string): void;
  public abstract async requestExtras(environment: ICoreEnvironment, requestedExtras: IExtrasRequest, forceReload?: boolean): Promise<void>;
  public abstract async openInstancePopup(workspaceId: string, instanceId: string, todoId?: string): Promise<void>;
  public abstract async openTodoPopup(workspaceId: string, instanceId: string, todoId: string): Promise<void>;
}
