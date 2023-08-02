export interface IGroupDetails {
  groupId: string;
  workspaceId?: string;
  displayName: string;
  description: string;
  /* Only the member ids are included for performance reasons - all groups members are also workspace members,
  user details can be found in workspace details (.extras.members) */
  memberIds: string[];
}
