import { IFieldContentMap } from "../../data/ifieldcontentmap";
import { IFieldValue } from "../../data/ifieldvalue";
import { IUserDetailsSmall } from "../../user/userinterfaces";

export interface IQuestion {
  id: string;
  // Values of predefined audit fields
  noteText: string;
  questionText: string;
  answer: IFieldValue;
  files: string[];
  rating?: number;
  // Values of custom fields that where defined in the audit question field
  customFields?: IFieldContentMap;
  // Order of the question in the question grid in the audit instance
  orderIndex: number;
}

export interface IQuestionCatalogNode {
  id: string;
  text: string;
  questions: IQuestion[];
  childNodes: IQuestionCatalogNode[];
}

export interface IQuestionCatalogRevisionUser extends Omit<IUserDetailsSmall, "uid"> {
  uid?: string;
}

export interface IQuestionCatalogRevision {
  counter: number;
  editedBy: IQuestionCatalogRevisionUser;
  editDate: Date;
  hasNodesChanged: boolean;
  hasQuestionsChanged: boolean;
}

export default interface IQuestionCatalog {
  id: string;
  revision: IQuestionCatalogRevision;
  nodes: IQuestionCatalogNode[];
  questionSourceIdMap: {
    [questionId: string]: string;
  };
}
