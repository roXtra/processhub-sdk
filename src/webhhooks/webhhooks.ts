import { FieldValueType } from "../data/ifieldvalue.js";
import { IBaseReply } from "../legacyapi/apiinterfaces.js";

/**
 * Returns the URL without host and basepath, eg. /webhook/v1/trigger/8A8EB51B5CFBF1CD/BoundaryEvent_9373BD9414921009/659cf90ede434ac3.
 * Can be used to trigger a StartEvent for a process or an IntermediateEvent/BoundaryEvent for an instance.
 * Combine with {@link getBackendUrl} to get the full URL.
 * @param processId Id of the process containing the event
 * @param eventId Id of the bpmn element to trigger - StartEvent, IntermediateEvent or BoundaryEvent with MessageEventDefinition
 * @param instanceId Must be set if eventId refers to an IntermediateEvent or BoundaryEvent
 * @returns {string} URL without host and basepath, eg. /webhook/v1/trigger/8A8EB51B5CFBF1CD/BoundaryEvent_9373BD9414921009/659cf90ede434ac3.
 */
export function getWebhookTriggerRoute(processId: string, eventId: string, instanceId?: string): string {
  if (instanceId) {
    return `/webhook/v1/trigger/${processId}/${eventId}/${instanceId}`;
  } else {
    return `/webhook/v1/trigger/${processId}/${eventId}`;
  }
}

export interface IWebhookTriggerResponse extends IBaseReply {
  errorMsg?: string;
  instanceId?: string;
}

export interface IWebhookTriggerRequest {
  /**
   * A field named "fieldName" must exist in any acitivity (StartEvent/UserTask/...) in the process.
   * The key must match the type of the field (see {@link FieldValueType} for options).
   */
  fields?: { [fieldName: string]: FieldValueType };
  /**
   * If set, the instance id of the created instance will be this one. Only applies to message startevents
   */
  instanceId?: string;
}
