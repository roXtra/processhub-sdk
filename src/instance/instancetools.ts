import { isFieldValue } from "../data/datainterfaces";
import { InstanceDetails } from "./instanceinterfaces";
import { isValidMailAddress, stringExcerpt } from "../tools/stringtools";
import { isId } from "../tools/guid";

export function getInstanceMailAddress(instanceId: string): string {
  return "i-" + instanceId.toLowerCase() + "@processhub.net";
}
export function parseInstanceMailAddress(mail: string): string {
  mail = mail.toLowerCase();
  if (!isValidMailAddress(mail) || !mail.startsWith("i-"))
    return null;

  let instanceId = mail.split("@")[0].substr(2).toUpperCase();
  if (isId(instanceId))
    return instanceId;
  else
    return null;
}

export function latestActivityAt(instance: InstanceDetails): Date {
  let latestAt = instance.latestCommentAt;
  if (latestAt == null)
    latestAt = instance.createdAt;

  if (instance.extras.todos) {
    instance.extras.todos.map(todo => { 
      if (latestAt == null || todo.createdAt > latestAt)
        latestAt = todo.createdAt; 
    });
  }

  return latestAt;
}

// roleID == null -> check for any role membership
export function isRoleOwner(userId: string, roleId: string, instance: InstanceDetails): boolean {
  if (instance.extras.roleOwners == null)
    return false;

  if (roleId == null || roleId == "") {
    // check if user is owner of any role
    for (let role in instance.extras.roleOwners) {
      if (isRoleOwner(userId, role, instance))
        return true;
    }
    return false;
  }

  if (instance.extras.roleOwners[roleId] == null)
    return false;

  instance.extras.roleOwners[roleId].map(roleOwner => {
    if (roleOwner.memberId == userId)
      return true;
  });

  return false;
}

export function fieldContentsExcerpt(instance: InstanceDetails, maxLen: number): string {
  if (instance == null || instance.extras.fieldContents == null)
    return "";

  let excerpt = "";
  for (const key in instance.extras.fieldContents) {
    const field = instance.extras.fieldContents[key];

    if (isFieldValue(field)) {
      let value = field.value;
      if (typeof value == "string") {
        if (field.type == "ProcessHubDate") {
          // format date
          const date: Date = new Date(value);
          value = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
        }
        if (field.type != "ProcessHubTextArea")
          excerpt += value.toString() + " / ";
      }
    } else {
      if (typeof (field) == "string"
        && (field as string).trim() != ""
        && !(field as string).startsWith("http://")
        && !(field as string).startsWith("https://")) {
        excerpt += instance.extras.fieldContents[key] + " / ";
      }
    }
  }
  if (excerpt.endsWith(" / "))
    excerpt = excerpt.substr(0, excerpt.length - 3);

  return stringExcerpt(excerpt, maxLen);
}