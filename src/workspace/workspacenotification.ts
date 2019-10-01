import * as PH from "../";

// Any new notifications for the workspace?
export function notifyNewWorkspaceTodosOrComments(workspaceEnv: PH.WorkspaceEnvironment): boolean {
  if (!workspaceEnv.user || !workspaceEnv.workspace)
    return false;

  const instances = PH.Instance.filterInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace.workspaceId);
  let notify = false;

  instances.map(instance => {
    const instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
    if (PH.Instance.notifyNewInstanceComments(instanceEnv) || PH.Instance.notifyNewInstanceTodos(instanceEnv) || PH.Instance.notifyInstancePin(instanceEnv))
      notify = true;
  });

  return notify;
}