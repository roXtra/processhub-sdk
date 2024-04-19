import { IFieldConfig } from "./datainterfaces.js";
import { FieldType } from "./ifieldvalue.js";

export interface IFieldDefinition {
  name: string;
  type: FieldType;
  isRequired: boolean;
  isRestricted?: boolean;
  // Is it allowed to edit the field config directly from a running instance (for process managers)?
  inlineEditingActive: boolean | undefined;
  config: IFieldConfig;
  auditQuestionsMode?: "plan" | "answer";
}

export interface IFieldDefinitionItem {
  bpmnTaskId: string;
  isStartEvent: boolean;
  fieldDefinition: IFieldDefinition;
}
