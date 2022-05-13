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
  public abstract gotoPage(path: string): void;
  public abstract requestExtras(environment: ICoreEnvironment, requestedExtras: IExtrasRequest, forceReload?: boolean): Promise<void>;
  public abstract openInstancePopup(workspaceId: string, instanceId: string, todoId: string | undefined, readonly: boolean): Promise<void>;
  public abstract openTodoPopup(workspaceId: string, instanceId: string, todoId: string): Promise<void>;
}
