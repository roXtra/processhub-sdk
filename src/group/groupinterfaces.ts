import { UserDetails } from "../user";

export interface IGroupDetails {
  groupId: string;
  workspaceId?: string;
  displayName: string;
  description: string;
  members: UserDetails[];
}