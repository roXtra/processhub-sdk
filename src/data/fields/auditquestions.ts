import IQuestionCatalog from "../../modules/audits/iquestioncatalog";

export interface IAuditQuestionsFieldValue {
  questionCatalog: IQuestionCatalog | undefined;
  questionsId?: string;
}
