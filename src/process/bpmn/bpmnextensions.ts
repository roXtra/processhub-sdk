import { TaskSettingsValueType, BpmnExtensionName, ITaskExtensions } from "../processinterfaces";
import { Bpmn } from "modeler/bpmn/bpmn";
import { replaceOldFieldSyntax } from "../../tools/stringtools";
import { ILegacySchema, updateLegacyFieldDefinitions } from "../../data/datatools";
import { Processhub } from "modeler/bpmn/processhub";
import { bpmnModdleInstance } from "./bpmnmoddlehelper";

export function getExtensionValues(activityObject: Bpmn.IActivity | undefined): ITaskExtensions {
  const returnValue: ITaskExtensions = {
    description: undefined,
    fieldDefinitions: undefined,
    sendTaskReceiver: undefined,
    sendTaskInstanceLink: true,
    sendTaskSubject: undefined,
    sendTaskWithFieldContents: true,
    allFieldsEditable: false,
    roleOwnersEditable: false,
    viewAllFields: true,
    allowTaskClaim: true,
    dueAtDateCanBeEdit: false,
    dueAtDuration: undefined,
    sendMailNotification: true,
    requiredFieldsNeeded: undefined,
    saveDecisionInFieldContents: false,
    customFieldContentsValue: undefined,

    serviceTaskConfigObject: undefined,
    scriptTaskCode: undefined,
    scriptTaskCodeObjects: [],

    subProcessId: undefined,
    subProcessFieldMapping: [],

    sequenceFlowExpression: undefined,
    isBuilderExpression: false,

    fieldsWhichShouldSend: undefined,
    dateFieldTimer: undefined,
    roXtraVersion: undefined,

    anonymousStart: undefined,
    anonymousStartUserId: undefined,

    signalCatchEventRoles: undefined,
  };

  if (activityObject == null || activityObject.extensionElements == null || (activityObject.extensionElements != null && activityObject.extensionElements.values == null)) {
    return returnValue;
  }

  for (const values of activityObject.extensionElements.values) {
    if (values != null && values.$children != null) {
      for (const child of values.$children) {
        switch (child.name as BpmnExtensionName) {
          case "sequenceflow-expression":
            returnValue.sequenceFlowExpression = child.$body ? replaceOldFieldSyntax(child.$body) : child.$body;
            break;
          case "isBuilder-expression":
            returnValue.isBuilderExpression = child.$body === "true";
            break;
          case "subprocessid":
            returnValue.subProcessId = child.$body;
            break;
          case "subprocess-fieldmapping":
            returnValue.subProcessFieldMapping = child.$body ? JSON.parse(child.$body) : [];
            break;
          case "subprocess-starteventid":
            returnValue.subProcessStartEventId = child.$body;
            break;
          case "description":
            returnValue.description = child.$body;
            break;
          case "roxtra-version":
            returnValue.roXtraVersion = child.$body;
            break;
          case "send-task-subject":
            returnValue.sendTaskSubject = child.$body;
            break;
          case "send-task-instance-link":
            returnValue.sendTaskInstanceLink = child.$body === "true";
            break;
          case "send-task-with-field-contents":
            returnValue.sendTaskWithFieldContents = child.$body !== "false";
            break;
          case "roleowners-editable":
            returnValue.roleOwnersEditable = child.$body !== "false";
            break;
          case "anonymous-start":
            returnValue.anonymousStart = child.$body === "true";
            break;
          case "anonymous-start-userid":
            returnValue.anonymousStartUserId = child.$body;
            break;
          case "all-fields-editable":
            returnValue.allFieldsEditable = child.$body !== "false";
            break;
          case "send-mail-notification":
            returnValue.sendMailNotification = child.$body !== "false";
            break;
          case "view-all-fields":
            returnValue.viewAllFields = child.$body !== "false";
            break;
          case "allow-task-claim":
            returnValue.allowTaskClaim = child.$body !== "false";
            break;
          case "due-at-can-be-edit":
            returnValue.dueAtDateCanBeEdit = child.$body !== "false";
            break;
          case "due-at-duration":
            returnValue.dueAtDuration = child.$body;
            break;
          case "datefield-for-timercatch":
            returnValue.dateFieldTimer = child.$body;
            break;
          case "script-task-code":
            returnValue.scriptTaskCode = child.$body;
            break;
          case "script-task-code-objects":
            returnValue.scriptTaskCodeObjects = child.$body ? JSON.parse(child.$body) : [];
            break;
          case "service-task-config-object":
            if (child.$body) {
              returnValue.serviceTaskConfigObject = JSON.parse(child.$body);
            }
            break;
          case "fields-which-should-send":
            try {
              if (child.$body && child.$body.length > 0) {
                returnValue.fieldsWhichShouldSend = JSON.parse(child.$body);
              } else {
                returnValue.fieldsWhichShouldSend = [];
              }
            } catch (ex) {
              console.log(ex);
              returnValue.fieldsWhichShouldSend = [];
            }
            break;
          case "required-fields-needed":
            {
              try {
                if (child.$body) {
                  returnValue.requiredFieldsNeeded = JSON.parse(child.$body);
                } else {
                  returnValue.requiredFieldsNeeded = [];
                }
              } catch (ex) {
                console.log(ex);

                returnValue.requiredFieldsNeeded = [];
              }
            }
            break;
          case "save-decision-in-fields":
            returnValue.saveDecisionInFieldContents = child.$body !== "false";
            break;
          case "custom-field-contents-value":
            if (child.$body) {
              returnValue.customFieldContentsValue = child.$body;
            }
            break;
          case "send-task-receiver":
            {
              try {
                if (child.$body) {
                  returnValue.sendTaskReceiver = JSON.parse(child.$body);
                } else {
                  returnValue.sendTaskReceiver = [];
                }
              } catch (ex) {
                console.log(ex);

                returnValue.sendTaskReceiver = [];
              }
            }
            break;
          case "processhub-userform":
            if (child.$body) {
              const definitions: ILegacySchema = JSON.parse(child.$body);
              returnValue.fieldDefinitions = updateLegacyFieldDefinitions(definitions);
            }
            break;
          case "message-event-type":
            returnValue.messageEventType = child.$body;
            break;
          case "mail-body-parse-fields":
            returnValue.mailBodyParseFields = child.$body !== "false";
            break;
          case "webhook-body-to-field":
            returnValue.webhookBodyToField = child.$body !== "false";
            break;
          case "signalcatchevent-roles":
            try {
              if (child.$body && child.$body.length > 0) {
                returnValue.signalCatchEventRoles = JSON.parse(child.$body);
              } else {
                returnValue.signalCatchEventRoles = [];
              }
            } catch (ex) {
              console.log(ex);
              returnValue.signalCatchEventRoles = [];
            }
            break;
          case "copy-fields":
            returnValue.copyFields = child.$body === "true";
            break;
          default:
            break;
        }
      }
    }
  }
  return returnValue;
}

export function addOrUpdateExtension(baseElement: Bpmn.IBaseElement, key: BpmnExtensionName, value: string | boolean | {}[], extensionValueType: TaskSettingsValueType): void {
  if (extensionValueType === "List") {
    value = JSON.stringify(value);
  }

  if (extensionValueType === "Boolean") {
    value = Boolean(value).toString();
  }

  if (value == null) value = "";

  if (!baseElement.extensionElements) {
    baseElement.extensionElements = bpmnModdleInstance.create("bpmn:ExtensionElements", { values: [] });
  }
  let phInOut = baseElement.extensionElements.values.find((e) => e.$type === "processhub:inputOutput") as Processhub.IInputOutput;
  if (!phInOut || phInOut.$children == null) {
    phInOut = bpmnModdleInstance.createAny("processhub:inputOutput", "http://processhub.com/schema/1.0/bpmn", {}) as Processhub.IInputOutput;
    phInOut.$children = [];
    baseElement.extensionElements.values.push(phInOut);
  }
  let settingsElement = phInOut.$children.find((c) => (c as Processhub.IInputParameter).name === key);
  if (!settingsElement) {
    settingsElement = bpmnModdleInstance.createAny("processhub:inputParameter", "http://processhub.com/schema/1.0/bpmn", { name: key });
    phInOut.$children.push(settingsElement);
  }

  settingsElement.$body = value as string;
}

export function getExtensionBody(flowNode: Bpmn.IFlowNode, settingsName: BpmnExtensionName): string | undefined {
  if (flowNode.extensionElements && flowNode.extensionElements.values) {
    const phInOut = flowNode.extensionElements.values.find((e) => e.$type === "processhub:inputOutput") as Processhub.IInputOutput;
    if (phInOut && phInOut.$children) {
      const descriptionElement = phInOut.$children.find((c) => (c as Processhub.IInputParameter).name === settingsName);
      if (descriptionElement && descriptionElement.$body) {
        return descriptionElement.$body;
      }
    }
  }
  return undefined;
}
