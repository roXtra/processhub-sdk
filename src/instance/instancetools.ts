import { isFieldValue } from "../data/datainterfaces";
import { IInstanceDetails } from "./instanceinterfaces";
import { stringExcerpt } from "../tools/stringtools";
import { isId } from "../tools/guid";
import { isDefaultProcessRole } from "../process";

export function parseInstanceMailSubject(mail: string): string | undefined {
  const regex = /(\[)(i-)(.*?)(\])/gm;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(mail)) != null) {
    let maybeId: string = match[3];
    maybeId = maybeId.toUpperCase();
    if (isId(maybeId)) {
      return maybeId;
    }
  }
  return undefined;
}

// RoleID == null -> check for any role membership
export function isRoleOwner(userId: string, roleId: string | undefined, instance: IInstanceDetails): boolean {
  if (instance.extras.roleOwners == null) return false;

  if (roleId == null || roleId === "") {
    // Check if user is owner of any role
    for (const role in instance.extras.roleOwners) {
      if (!isDefaultProcessRole(role) && isRoleOwner(userId, role, instance)) return true;
    }
    return false;
  }

  if (instance.extras.roleOwners[roleId] == null) return false;

  for (const roleOwner of instance.extras.roleOwners[roleId]) {
    if (roleOwner.memberId === userId) return true;
  }

  return false;
}

export function fieldContentsExcerpt(instance: IInstanceDetails | undefined, maxLen: number): string {
  if (instance == null || instance.extras.fieldContents == null) return "";

  let excerpt = "";
  for (const key in instance.extras.fieldContents) {
    const field = instance.extras.fieldContents[key];

    if (isFieldValue(field)) {
      let value = field.value;
      if (typeof value === "string") {
        if (field.type === "ProcessHubDate") {
          // Format date
          const date: Date = new Date(value);
          value = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
        }
        if (field.type !== "ProcessHubTextArea") excerpt += value.toString() + " / ";
      }
    } else {
      if (typeof field === "string" && field.trim() !== "" && !field.startsWith("http://") && !field.startsWith("https://")) {
        excerpt += (instance.extras.fieldContents[key] as string) + " / ";
      }
    }
  }
  if (excerpt.endsWith(" / ")) excerpt = excerpt.substr(0, excerpt.length - 3);

  return stringExcerpt(excerpt, maxLen);
}
