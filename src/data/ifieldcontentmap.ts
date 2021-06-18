import { IFieldValue } from "./ifieldvalue";

export interface IFieldContentMap {
  [fieldId: string]: string | string[] | boolean | IFieldValue;
}
