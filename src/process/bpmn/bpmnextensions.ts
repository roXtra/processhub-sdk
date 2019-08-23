import { TaskSettingsValueType, BpmnExtensionName, TaskExtensions } from "../processinterfaces";
import { Bpmn } from "modeler/bpmn/bpmn";
import { replaceOldFieldSyntax } from "../../tools/stringtools";
import { updateLegacyFieldDefinitions } from "../../data/datatools";
import BpmnModdle = require("bpmn-moddle");
import { Processhub } from "modeler/bpmn/processhub";
import { createTaskExtensionTemplate, addTaskExtensionInputText } from "./bpmnmoddlehelper";

export function getExtensionValues(activityObject: Bpmn.Activity): TaskExtensions {
  let returnValue: TaskExtensions = {
    description: undefined,
    fieldDefinitions: undefined,
    sendTaskReceiver: undefined,
    sendTaskInstanceLink: true,
    sendTaskSubject: undefined,
    sendTaskWithFieldContents: true,
    allFieldsEditable: false,
    roleOwnersEditable: false,
    viewAllFields: true,
    dueAtDateCanBeEdit: false,
    dueAtDuration: undefined,
    sendMailNotification: true,
    requiredFieldsNeeded: undefined,
    saveDecisionInFieldContents: false,
    customFieldContentsValue: undefined,

    serviceTaskApiUrl: undefined,
    serviceTaskRequestObjectString: undefined,
    serviceTaskResponseFieldName: undefined,
    serviceTaskConfigObject: undefined,
    scriptTaskCode: undefined,

    timerStartConfiguration: undefined,

    subProcessId: undefined,

    sequenceFlowExpression: undefined,
    isBuilderExpression: false,

    fieldsWhichShouldSend: undefined,
    dateFieldTimer: undefined,
    roXtraVersion: undefined,
  };

  if (activityObject == null || activityObject.extensionElements == null || (activityObject.extensionElements != null && activityObject.extensionElements.values == null)) {
    return returnValue;
  }

  for (let values of activityObject.extensionElements.values) {
    if (values != null && values.$children != null) {
      for (let child of values.$children) {
        switch (child.name as BpmnExtensionName) {
          case "sequenceflow-expression":
            returnValue.sequenceFlowExpression = child.$body ? replaceOldFieldSyntax(child.$body) : child.$body;
            break;
          case "isBuilder-expression":
            returnValue.isBuilderExpression = child.$body == "true";
            break;
          case "subprocessid":
            returnValue.subProcessId = child.$body;
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
            returnValue.sendTaskInstanceLink = child.$body == "true";
            break;
          case "send-task-with-field-contents":
            returnValue.sendTaskWithFieldContents = child.$body != "false";
            break;
          case "roleowners-editable":
            returnValue.roleOwnersEditable = child.$body != "false";
          case "all-fields-editable":
            returnValue.allFieldsEditable = child.$body != "false";
            break;
          case "send-mail-notification":
            returnValue.sendMailNotification = child.$body != "false";
            break;
          case "view-all-fields":
            returnValue.viewAllFields = child.$body != "false";
            break;
          case "due-at-can-be-edit":
            returnValue.dueAtDateCanBeEdit = child.$body != "false";
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
          case "service-task-config-object":
            returnValue.serviceTaskConfigObject = JSON.parse(child.$body);
            break;
          case "fields-which-should-send":
            returnValue.fieldsWhichShouldSend = JSON.parse(child.$body);
            break;
          case "required-fields-needed": {
            try {
              returnValue.requiredFieldsNeeded = JSON.parse(child.$body);
            } catch (ex) {
              console.log(ex);

              returnValue.requiredFieldsNeeded = [];
            }
          }
            break;
          case "save-decision-in-fields":
            returnValue.saveDecisionInFieldContents = child.$body != "false";
            break;
          case "custom-field-contents-value":
            returnValue.customFieldContentsValue = child.$body;
            break;
          case "send-task-receiver": {
            try {
              returnValue.sendTaskReceiver = JSON.parse(child.$body);
            } catch (ex) {
              console.log(ex);

              returnValue.sendTaskReceiver = [];
            }
          }
            break;
          case "processhub-userform":
            returnValue.fieldDefinitions = updateLegacyFieldDefinitions(JSON.parse(child.$body));
            break;

          case "service-task-api-url":
            returnValue.serviceTaskApiUrl = child.$body;
            break;
          case "service-task-request-object":
            returnValue.serviceTaskRequestObjectString = child.$body;
            break;
          case "service-task-response-fieldname":
            returnValue.serviceTaskResponseFieldName = child.$body;
            break;

          case "timer-start-configuration":
            returnValue.timerStartConfiguration = JSON.parse(child.$body);
            break;

          default:
            break;
        }
      }
    }
  }
  return returnValue;
}

export function addOrUpdateExtension(baseElement: Bpmn.BaseElement, key: BpmnExtensionName, value: string | boolean | {}[], extensionValueType: TaskSettingsValueType): void {

  if (extensionValueType === "List") {
    value = JSON.stringify(value);
  }

  if (extensionValueType === "Boolean") {
    value = Boolean(value).toString();
  }

  if (value == null)
    value = "";

  if (!baseElement.extensionElements || baseElement.extensionElements.values == null) {
    let extensions: Bpmn.ExtensionElements = createTaskExtensionTemplate();
    baseElement.extensionElements = extensions;
  }

  // remove second processhub:inputOutput
  if (baseElement.extensionElements.values.length > 1) {
    baseElement.extensionElements.values = [baseElement.extensionElements.values[0]];
  }

  for (let extension of baseElement.extensionElements.values) {
    if (extension.$children != null) {
      extension.$children = extension.$children.filter(child => child.name !== key);
      // extensionElement = extension.$children.find(e => e.name === key);
    }
  }

  addTaskExtensionInputText(baseElement.extensionElements, key, value as string);
}

export function getExtensionBody(flowNode: Bpmn.FlowNode, settingsName: string): string {
  if (flowNode.extensionElements && flowNode.extensionElements.values) {
    const phInOut = flowNode.extensionElements.values.find(e => e.$type === "processhub:inputOutput") as Processhub.InputOutput;
    if (phInOut && phInOut.$children) {
      const descriptionElement = phInOut.$children.find(c => (c as Processhub.InputParameter).name === settingsName);
      if (descriptionElement && descriptionElement.$body) {
        return descriptionElement.$body;
      }
    }
  }
  return null;
}

export function setExtensionBody(flowNode: Bpmn.FlowNode, settingsName: string, value: string): void {
  const bpmnModdle = new BpmnModdle([], {});
  if (!flowNode.extensionElements) {
    flowNode.extensionElements = bpmnModdle.create("bpmn:ExtensionElements", { values: [] });
  }
  let phInOut = flowNode.extensionElements.values.find(e => e.$type === "processhub:inputOutput") as Processhub.InputOutput;
  if (!phInOut || phInOut.$children == null) {
    phInOut = bpmnModdle.createAny("processhub:inputOutput", "http://processhub.com/schema/1.0/bpmn", { $children: [] });
    flowNode.extensionElements.values.push(phInOut);
  }
  let settingsElement = phInOut.$children.find(c => (c as Processhub.InputParameter).name === settingsName);
  if (!settingsElement) {
    settingsElement = bpmnModdle.createAny("processhub:inputParameter", "http://processhub.com/schema/1.0/bpmn", { name: settingsName });
    phInOut.$children.push(settingsElement);
  }

  if (value != null)
    settingsElement.$body = value;
  else
    settingsElement.$body = "";
}


