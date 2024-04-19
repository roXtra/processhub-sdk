import { IFieldValue } from "./ifieldvalue.js";

export interface IFieldContentMap {
  [fieldId: string]: IFieldValue | undefined;
}
