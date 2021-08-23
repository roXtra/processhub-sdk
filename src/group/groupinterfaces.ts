import { IUserDetails } from "../user/userinterfaces";

export interface IGroupDetails {
  groupId: string;
  workspaceId?: string;
  displayName: string;
  description: string;
  members: IUserDetails[];
}
