import { IGroupDetails } from "./groupinterfaces";

export const GroupRequestRoutes = {
  Create: "/api/group/create",
  Delete: "/api/group/delete",
  Edit: "/api/group/edit",
  SetMembers: "/api/group/setmembers",
  AddMember: "/api/group/addmember",
  RemoveMember: "/api/group/removemember",
};

export type GroupRequestRoutes = keyof typeof GroupRequestRoutes;

export interface ICreateGroupRequest {
  group: IGroupDetails;
}

export interface IDeleteGroupRequest {
  groupId: string;
}

export interface IEditGroupRequest {
  groupId: string;
  displayName: string;
  description: string;
}

export interface ISetGroupMembersRequest {
  groupId: string;
  memberIds: string[];
}

export interface IAddMemberToGroupRequest {
  groupId: string;
  memberId: string;
}

export interface IRemoveMemberFromGroupRequest {
  groupId: string;
  memberId: string;
}
