import { IFieldConfig } from "./datainterfaces.js";
import { IFieldDefinition } from "./ifielddefinition.js";
import { FieldValueType } from "./ifieldvalue.js";

export interface IFormElementProps<ConfigType extends IFieldConfig, ValueType extends FieldValueType> {
  value: ValueType | undefined | null;
  label: string;
  required: boolean;
  restricted: boolean;
  // Is it allowed to edit the field config directly from a running instance (for process managers)?
  inlineEditingActive: boolean | undefined;
  disabled: boolean;
  config: ConfigType;
  key?: string;
  auditQuestionsMode?: IFieldDefinition["auditQuestionsMode"];
}
