import { ModuleId, ModuleName } from "../modules/imodule";

export interface IRoxFile {
  name: string;
  fileId: number;
  /**
   * File name of the mime type icon without URL/hostname (eg "docx.svg")
   */
  mimeTypeIcon: string;
}

export interface IRoxFolder {
  name: string;
  folderId: number;
}

export interface IEscalation {
  EnableMobileEdit: boolean;
  Id: string;
  ParentFileID: number;
  ShortSubject: string;
  Title: string;
}

export interface ITodo {
  EnableMobileEdit: boolean;
  Id: string;
  ShortSubject: string;
  Subject: string;
}

export interface IModuleSelection {
  id?: string;
  title: string;
  items?: IModuleItem[];
}

export interface IModuleItem {
  id?: number;
  // Name of module sub type if moduleType === ModuleId.Module; (eg "audit" or "action")
  name?: ModuleName;
  type: ModuleId;
  // Title of the module, will be displayed to the user (eg "Maßnahmen")
  title: string;
  subtitle?: string;
  class?: string;
  url?: string;
  todourl?: string;
  target: string;
}
