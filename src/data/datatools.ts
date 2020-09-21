import { IFieldContentMap, isFieldValue, IFieldDefinition, FieldType, IFieldValue } from "./datainterfaces";
import { getFormattedDate, getFormattedDateTime, getFormattedTimeZoneOffset } from "../tools/timing";
import { IRoleOwnerMap, IRoleOwner, IProcessRoles, BpmnProcess } from "../process";
import { replaceOldFieldSyntax } from "../tools";

const fieldNameRegExp = /field\['([^'\]]*)'\]/;
const roleNameRegExp = /role\['([^'\]]*)'\](\.(firstName|lastName|displayName))?/;

export function replaceAll(target: string, search: string, replacement?: string): string {
  if (!replacement) {
    replacement = "";
  }
  while (target.includes(search)) {
    target = target.replace(search, replacement);
  }
  return target;
}

function fieldValueToString(valueObject: IFieldValue): string {
  if (valueObject.value == null) {
    return "";
  }
  let res: string;
  if (valueObject.type === "ProcessHubDate") {
    res = getFormattedDate(new Date(valueObject.value.toString()));
  } else if (valueObject.type === "ProcessHubDateTime") {
    const date: Date = new Date(valueObject.value.toString());
    res = getFormattedDateTime(date) + " " + getFormattedTimeZoneOffset(date.getTimezoneOffset());
  } else {
    res = valueObject.value.toString();
  }
  return res;
}

// Different types of parameter procesOrRoles to support old services (customer)
export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: IFieldContentMap | undefined, processOrRoles: IProcessRoles, roleOwners: IRoleOwnerMap): string | undefined;
export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: IFieldContentMap | undefined, processOrRoles: BpmnProcess, roleOwners: IRoleOwnerMap): string | undefined;
export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: IFieldContentMap | undefined, processOrRoles: BpmnProcess | IProcessRoles, roleOwners: IRoleOwnerMap): string | undefined {
  if (inputString == null)
    return undefined;
  if (fieldContentMap == null)
    return inputString;

  const groupIndexForFieldPlaceholder = 0;
  const groupIndexForFieldIdentifier = 1;

  let result: string = replaceOldFieldSyntax(inputString);
  let match: RegExpExecArray | null = fieldNameRegExp.exec(result);

  while (match) {

    const fieldPlaceholder = match[groupIndexForFieldPlaceholder];
    const fieldName = match[groupIndexForFieldIdentifier];

    if (fieldName != null) {
      const valueObject = fieldContentMap[fieldName];

      if (isFieldValue(valueObject)) {
        const val: string = fieldValueToString(valueObject);
        result = replaceAll(result, fieldPlaceholder, val);
      } else {
        result = replaceAll(result, fieldPlaceholder, valueObject != null ? valueObject.toString() : "");
      }
    }

    result = replaceAll(result, fieldPlaceholder, "");
    match = fieldNameRegExp.exec(result);
  }

  const groupIndexForRolePlaceholder = 0;
  const groupIndexForRoleIdentifier = 1;
  const groupIndexForRoleProperty = 3;

  match = roleNameRegExp.exec(result);

  while (match) {
    const placeHolder: string = match[groupIndexForRolePlaceholder];
    const roleName: string = match[groupIndexForRoleIdentifier];
    let roleProperty: string | undefined = undefined;
    if (match.length === 4) {
      roleProperty = match[groupIndexForRoleProperty];
    }
    if (roleName != null) {
      const laneId = processOrRoles instanceof BpmnProcess ? processOrRoles.getLanes(false).find(l => l.name === roleName)?.id : Object.keys(processOrRoles).find(key => processOrRoles[key].roleName == roleName);
      if (laneId) {
        const roleOwner: IRoleOwner[] = roleOwners[laneId];
        if (roleOwner && roleOwner.length) {
          result = replaceAll(result, placeHolder, (roleProperty && roleOwner[0].user) ? ((roleOwner[0]).user as unknown as { [key: string]: string })[roleProperty] : roleOwner[0].displayName);
        } else {
          result = replaceAll(result, placeHolder, "");
        }
      }
    }

    result = replaceAll(result, placeHolder, "");
    match = roleNameRegExp.exec(result);
  }

  const newFieldRegex = /[{]{1}[\s]?field\[['"]?(.+?)['"]?\][\s]?[}]{1}/g;
  while ((match = newFieldRegex.exec(result)) != null) {
    const placeHolder: string = match[0];
    const fieldName: string = match[1];

    if (fieldName && fieldName.length) {
      const valueObject = fieldContentMap[fieldName];
      if (isFieldValue(valueObject)) {
        const val: string = fieldValueToString(valueObject);
        result = replaceAll(result, placeHolder, val);
      } else {
        result = replaceAll(result, placeHolder, valueObject != null ? valueObject.toString() : "");
      }
    }
    result = replaceAll(result, placeHolder, "");
  }

  const newRoleRegex = /[{]{1}[\s]?role\[['"]?(.+?)['"]?\][\s]?[}]{1}/g;
  while ((match = newRoleRegex.exec(result)) != null) {

    const placeHolder: string = match[0];
    const roleName: string = match[1];

    if (roleName && roleName.length) {
      const laneId = processOrRoles instanceof BpmnProcess ? processOrRoles.getLanes(false).find(l => l.name === roleName)?.id : Object.keys(processOrRoles).find(key => processOrRoles[key].roleName == roleName);
      if (laneId) {
        const roleOwner = roleOwners[laneId];
        if (roleOwner && roleOwner.length) {
          result = replaceAll(result, placeHolder, roleOwner[0].displayName);
        }
      }
    }
    result = replaceAll(result, placeHolder, "");
  }

  return result;
}

// Convert legacy FieldDefinitions in older processes to new array-based format
interface ILegacyProperty {
  customWidgetClass: string;
  required: boolean;
  title: string;
}
interface ILegacySchema {
  properties: { [id: string]: ILegacyProperty };
}
export function updateLegacyFieldDefinitions(definitions: ILegacySchema): IFieldDefinition[] {
  if (!(definitions instanceof Array)) {
    const properties: { [id: string]: ILegacyProperty } = definitions.properties;
    const updatedDefinitions: IFieldDefinition[] = [];
    for (const id in properties) {
      if (typeof id === "string") {
        const property: ILegacyProperty = properties[id];
        updatedDefinitions.push({
          config: { conditionExpression: undefined },
          isRequired: property.required,
          name: property.title,
          type: property.customWidgetClass as FieldType,
        });
      }
    }
    return updatedDefinitions;
  } else
    return definitions as IFieldDefinition[];
}