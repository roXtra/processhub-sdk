import { IUserDetailsSmall } from "../../user/userinterfaces.js";

export interface IQuestion {
  id: string;
  noteText: string;
  questionText: string;
}

export interface IQuestionCatalogNode {
  id: string;
  text: string;
  questions: IQuestion[];
  childNodes: IQuestionCatalogNode[];
}

export interface IQuestionCatalogRevision {
  counter: number;
  editedBy: IUserDetailsSmall;
  editDate: Date;
  hasNodesChanged: boolean;
  hasQuestionsChanged: boolean;
}

export default interface IQuestionCatalog {
  id: string;
  revision: IQuestionCatalogRevision;
  nodes: IQuestionCatalogNode[];
}
