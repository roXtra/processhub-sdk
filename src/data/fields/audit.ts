import { IQuestion } from "../../modules/audits/iquestioncatalog";
import { IFieldConfigDefault } from "../datainterfaces";

export interface IAuditFieldValue {
  questions: IQuestion[];
  questionPaths: { [questionId: string]: string };
}

export interface IAuditFieldConfig extends IFieldConfigDefault<IAuditFieldValue> {
  mode: "plan";
}
