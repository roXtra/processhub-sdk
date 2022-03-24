import { IFieldValue } from "./ifieldvalue.js";

export interface IFieldContentMap {
  [fieldId: string]: string | string[] | boolean | IFieldValue;
}
