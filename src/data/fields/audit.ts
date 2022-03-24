import { IQuestion } from "../../modules/audits/iquestioncatalog.js";
import { IFieldConfigDefault } from "../datainterfaces.js";

export interface IAuditFieldValue {
  questions: IQuestion[];
  questionPaths: { [questionId: string]: string };
}

export interface IAuditFieldConfig extends IFieldConfigDefault<IAuditFieldValue> {
  mode: "plan";
}
