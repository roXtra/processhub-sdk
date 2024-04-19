import IQuestionCatalog from "../../modules/audits/iquestioncatalog.js";

export interface IAuditQuestionsFieldValue {
  questionCatalog: IQuestionCatalog | undefined;
  questionsId?: string;
}
