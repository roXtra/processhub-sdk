import { getFormattedDate, getFormattedDateTime, getFormattedTimeZoneOffset } from "../tools/timing";
import SqlString from "sqlstring";
import Joi from "joi";
import murmurhash from "murmurhash";
import { FieldType, IFieldValue } from "./ifieldvalue";
import { IFieldContentMap } from "./ifieldcontentmap";
import { IFieldDefinition } from "./ifielddefinition";
import { IProcessRoles, IRoleOwner, IRoleOwnerMap } from "../process/processrights";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { replaceOldFieldSyntax } from "../tools/stringtools";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { Language } from "../tl";

export const fieldNameRegExp = /field\['([^'\]]*)'\]/;
export const riskmetricRegExp = /riskMetric\['([^'\]]*)'\]/;
export const roleNameRegExp = /role\['([^'\]]*)'\](\.(firstName|lastName|displayName|mail))?/;

export function replaceAll(target: string, search: string, replacement?: string, isQuery?: boolean): string {
  if (!replacement) {
    replacement = "";
  }
  while (target.includes(search)) {
    if (isQuery) {
      // Is any type in the official @types/sqlstring package
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      let queryReplacement = SqlString.escape(replacement);
      queryReplacement = queryReplacement.slice(1, -1);
      target = target.replace(search, queryReplacement);
    } else {
      target = target.replace(search, replacement);
    }
  }
  return target;
}

function fieldValueToString(valueObject: IFieldValue, defaultValue: string, locale: Language): string {
  if (valueObject.value == null) {
    return defaultValue;
  }
  let res: string;
  if (valueObject.type === "ProcessHubDate") {
    res = getFormattedDate(new Date(valueObject.value.toString()), locale);
  } else if (valueObject.type === "ProcessHubDateTime") {
    const date: Date = new Date(valueObject.value.toString());
    res = getFormattedDateTime(date, locale) + " " + getFormattedTimeZoneOffset(date.getTimezoneOffset());
  } else {
    res = valueObject.value.toString();
  }
  return res;
}

// Different types of parameter procesOrRoles to support old services (customer)
export function parseAndInsertStringWithFieldContent(
  inputString: string,
  fieldContentMap: IFieldContentMap | undefined,
  processOrRoles: IProcessRoles,
  roleOwners: IRoleOwnerMap,
  locale: Language,
  isQuery?: boolean,
  defaultValue?: string,
  fieldValueToStringFn?: (fieldName: string, valueObject: IFieldValue) => string,
  instance?: IInstanceDetails,
  riskMetrics?: { [riskName: string]: number },
): string | undefined;
export function parseAndInsertStringWithFieldContent(
  inputString: string,
  fieldContentMap: IFieldContentMap | undefined,
  processOrRoles: BpmnProcess,
  roleOwners: IRoleOwnerMap,
  locale: Language,
  isQuery?: boolean,
  defaultValue?: string,
  fieldValueToStringFn?: (fieldName: string, valueObject: IFieldValue) => string,
  instance?: IInstanceDetails,
  riskMetrics?: { [riskName: string]: number },
): string | undefined;
export function parseAndInsertStringWithFieldContent(
  inputString: string,
  fieldContentMap: IFieldContentMap | undefined,
  processOrRoles: BpmnProcess | IProcessRoles,
  roleOwners: IRoleOwnerMap,
  locale: Language,
  isQuery?: boolean,
  defaultValue?: string,
  fieldValueToStringFn?: (fieldName: string, valueObject: IFieldValue) => string,
  instance?: IInstanceDetails,
  riskMetrics?: { [riskName: string]: number },
): string | undefined {
  if (inputString == null) return undefined;
  if (fieldContentMap == null) return inputString;
  defaultValue = defaultValue || "";

  if (fieldValueToStringFn == null) {
    fieldValueToStringFn = (fieldName, valueObject) => fieldValueToString(valueObject, defaultValue || "", locale);
  }

  const groupIndexForFieldPlaceholder = 0;
  const groupIndexForFieldIdentifier = 1;

  let result = replaceOldFieldSyntax(inputString);
  if (result == null) return undefined;

  let match: RegExpExecArray | null;

  if (instance) {
    const instanceRegex = /instance\['([^'\]]*)'\]/;
    match = instanceRegex.exec(result);
    while (match) {
      const placeholder = match[0];
      const key = match[1] as keyof IInstanceDetails;

      if (key) {
        switch (key) {
          case "instanceId":
            result = replaceAll(result, placeholder, instance.instanceId.toLowerCase(), isQuery);
            break;
          default:
            {
              const value = instance[key];
              result = replaceAll(result, placeholder, value != null ? value.toString() : defaultValue, isQuery);
            }
            break;
        }
      }
      match = instanceRegex.exec(result);
    }
  }

  match = fieldNameRegExp.exec(result);

  while (match) {
    const fieldPlaceholder = match[groupIndexForFieldPlaceholder];
    const fieldName = match[groupIndexForFieldIdentifier];

    if (fieldName != null) {
      const valueObject = fieldContentMap[fieldName];

      if (valueObject) {
        const val: string = fieldValueToStringFn(fieldName, valueObject);
        result = replaceAll(result, fieldPlaceholder, val, isQuery);
      } else {
        result = replaceAll(result, fieldPlaceholder, defaultValue, isQuery);
      }
    }

    result = replaceAll(result, fieldPlaceholder, defaultValue, isQuery);
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
      const laneId =
        processOrRoles instanceof BpmnProcess
          ? processOrRoles.getLanes(false).find((l) => l.name === roleName)?.id
          : Object.keys(processOrRoles).find((key) => processOrRoles[key].roleName == roleName);
      if (laneId) {
        const roleOwner: IRoleOwner[] = roleOwners[laneId];
        if (roleOwner && roleOwner.length) {
          result = replaceAll(
            result,
            placeHolder,
            roleProperty && roleOwner[0].user ? (roleOwner[0].user as unknown as { [key: string]: string })[roleProperty] : roleOwner[0].displayName,
            isQuery,
          );
        } else {
          result = replaceAll(result, placeHolder, defaultValue, isQuery);
        }
      }
    }

    result = replaceAll(result, placeHolder, defaultValue, isQuery);
    match = roleNameRegExp.exec(result);
  }

  const newFieldRegex = /[{]{1}[\s]?field\[['"]?(.+?)['"]?\][\s]?[}]{1}/g;
  while ((match = newFieldRegex.exec(result)) != null) {
    const placeHolder: string = match[0];
    const fieldName: string = match[1];

    if (fieldName && fieldName.length) {
      const valueObject = fieldContentMap[fieldName];
      if (valueObject) {
        const val: string = fieldValueToStringFn(fieldName, valueObject);
        result = replaceAll(result, placeHolder, val, isQuery);
      } else {
        result = replaceAll(result, placeHolder, defaultValue, isQuery);
      }
    }
    result = replaceAll(result, placeHolder, defaultValue, isQuery);
  }

  const newRoleRegex = /[{]{1}[\s]?role\[['"]?(.+?)['"]?\][\s]?[}]{1}/g;
  while ((match = newRoleRegex.exec(result)) != null) {
    const placeHolder: string = match[0];
    const roleName: string = match[1];

    if (roleName && roleName.length) {
      const laneId =
        processOrRoles instanceof BpmnProcess
          ? processOrRoles.getLanes(false).find((l) => l.name === roleName)?.id
          : Object.keys(processOrRoles).find((key) => processOrRoles[key].roleName == roleName);
      if (laneId) {
        const roleOwner = roleOwners[laneId];
        if (roleOwner && roleOwner.length) {
          result = replaceAll(result, placeHolder, roleOwner[0].displayName, isQuery);
        }
      }
    }
    result = replaceAll(result, placeHolder, defaultValue, isQuery);
  }

  if (riskMetrics) {
    // RiskMetrics
    while ((match = riskmetricRegExp.exec(result)) != null) {
      const placeHolder: string = match[0];
      const fieldName: string = match[1];

      if (fieldName && fieldName.length) {
        const val = riskMetrics[fieldName];
        result = replaceAll(result, placeHolder, val != null ? val.toString() : defaultValue, isQuery);
      }
    }
  }

  return result;
}

// Convert legacy FieldDefinitions in older processes to new array-based format
interface ILegacyProperty {
  customWidgetClass: string;
  required: boolean;
  title: string;
}
export interface ILegacySchema {
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
          config: { conditionExpression: "", conditionBuilderMode: true, validationExpression: "" },
          isRequired: property.required,
          inlineEditingActive: false,
          name: property.title,
          type: property.customWidgetClass as FieldType,
        });
      }
    }
    return updatedDefinitions;
  } else return definitions as IFieldDefinition[];
}

/**
 * @member allowUndefined If true, undefined will be a valid value
 * @default allowUndefined false
 * @member convert If true, the validation will try to cast a value to the correct type, if not possible an error will be thrown
 * @default convert false
 * @member  allowUnknown when true, allows object to contain unknown keys which are ignored.
 * @default  allowUnknown false
 */
type ValidateTypeOptions = {
  allowUndefined?: boolean;
  convert?: boolean;
  allowUnknown?: boolean;
};

/**
 * The method validateType will validate any element with a specific Joi schema.
 * If the value is valid validateType returns the element asserted to the specified type.
 * If the validation fails, a error will be thrown.
 *
 * @param schema The Joi schema which validate the value
 * @param element The element that should be validated
 * @param options Options for the validation
 */
export function validateType<T>(schema: Joi.Schema, element: unknown, options?: ValidateTypeOptions): T {
  const res = options?.allowUndefined
    ? schema.validate(element, { allowUnknown: options.allowUnknown })
    : schema.required().validate(element, { allowUnknown: options?.allowUnknown });
  if (res.error) {
    throw new Error(res.error.message);
  }

  return (options?.convert ? res.value : element) as T;
}

function intToRGB(number: number): string {
  const c = (number & 0x00ffffff).toString(16).toUpperCase();

  return "#" + "00000".substring(0, 6 - c.length) + c;
}

/**
 * The method objectToColor returns a hex color code for a given string.
 *
 * @param object any string
 * @returns a hex color code in the format #000000
 */
export function objectToColor(object: string | undefined): string {
  if (object === undefined) {
    return "#000000";
  }

  return intToRGB(murmurhash.v3(object));
}
