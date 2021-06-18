import { IFieldConfig } from "./datainterfaces";
import { FieldValueType } from "./ifieldvalue";

export interface IFormElementProps {
  value: FieldValueType | undefined | null;
  label: string;
  required: boolean;
  restricted: boolean;
  // Is it allowed to edit the field config directly from a running instance (for process managers)?
  inlineEditingActive: boolean | undefined;
  disabled: boolean;
  config: IFieldConfig;
  key?: string;
}
