import IQuestionCatalog from "../../modules/audits/iquestioncatalog";
import { IFieldConfigDefault } from "../datainterfaces";

export interface IAuditQuestionsFieldValue {
  questionCatalog: IQuestionCatalog;
}

export interface IAuditFieldConfig extends IFieldConfigDefault<IAuditQuestionsFieldValue> {
  mode: "plan";
}
