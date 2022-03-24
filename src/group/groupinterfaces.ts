import { IUserDetails } from "../user/userinterfaces.js";

export interface IGroupDetails {
  groupId: string;
  workspaceId?: string;
  displayName: string;
  description: string;
  members: IUserDetails[];
}
