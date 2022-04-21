import { IFieldValue } from "./ifieldvalue";

export interface IFieldContentMap {
  [fieldId: string]: IFieldValue | undefined;
}
