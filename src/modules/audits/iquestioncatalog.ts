import { IFieldValue } from "../../data/ifieldvalue";
import { IUserDetailsSmall } from "../../user/userinterfaces";

export interface IQuestion {
  id: string;
  noteText: string;
  questionText: string;
  answer: IFieldValue;
  files: string[];
  rating?: number;
  nodePath: string;
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
