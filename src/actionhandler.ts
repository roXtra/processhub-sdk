import { WorkspaceExtras } from "./workspace/workspaceinterfaces.js";
import { ProcessExtras } from "./process/processinterfaces.js";
import { InstanceExtras } from "./instance/instanceinterfaces.js";
import { UserExtras } from "./user/userinterfaces.js";
import { ICoreEnvironment } from "./environment.js";

export interface IExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export abstract class ActionHandler {
  // Load Page "/@workspace/..."
  public abstract gotoPage(path: string): void;
  public abstract requestExtras(environment: ICoreEnvironment, requestedExtras: IExtrasRequest, forceReload?: boolean): Promise<void>;
  public abstract openInstancePopup(workspaceId: string, instanceId: string, todoId?: string): Promise<void>;
  public abstract openTodoPopup(workspaceId: string, instanceId: string, todoId: string): Promise<void>;
}
