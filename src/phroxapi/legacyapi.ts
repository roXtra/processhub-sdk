import { IBaseReply, IBaseRequest } from "../legacyapi/apiinterfaces";
import { ITaskExtensions } from "../process/processinterfaces";
import { IModule } from "../modules/imodule";
import { IFieldContentMap } from "../data/ifieldcontentmap";
import { IModuleSelection, IRoxFile, IRoxFolder } from "./phroxapiinterfaces";

export const RequestRoutes = {
  GetRootFolder: "/api/phroxapi/getrootfolder",
  GetFolderContent: "/api/phroxapi/getfoldercontent",
  GetDocument: "/api/phroxapi/getdocument",
  GetProcessesForRoxFile: "/api/phroxapi/getprocessesforroxfile",
  SetCoporateDesign: "/api/phroxapi/setcoporatedesign",
  DownloadRoxDocToServer: "/api/phroxapi/downloadroxdoctoserver",
  GetProcessesWithGroup: "/api/phroxapi/getprocesseswithgroup",
  GetProcessesWithUser: "/api/phroxapi/getprocesseswithuser",
  GetFileDetails: "/api/phroxapi/getfiledetails",
  EcRoxFileProcessStart: "/api/phroxapi/ecroxfileprocessstart",
  EcRoxFileFieldEdit: "/api/phroxapi/ecroxfilefieldedit",
  EcSetFile: "/api/phroxapi/ecsetfile",
  EcReleaseFileLock: "/api/phroxapi/ecreleasefilelock",
  EcReleaseWithoutExecute: "/api/phroxapi/ecreleasewithoutexecute",
  EcGetFileLock: "/api/phroxapi/ecgetfilelock",
  GetModuleSettings: "/api/phroxapi/getmodulesettings",
  GetModules: "/api/phroxapi/getmodules",
  GetDocTypes: "/api/phroxapi/getdoctypes",
  GetRoxtraDocument: "/api/phroxapi/getroxtradocument",
  UploadRoxtraDocument: "/api/phroxapi/uploadroxtradocument",
  GetRights: "/api/phroxapi/getrights",
};

export interface IProcessItem {
  processName: string;
  processId: string;
  startButtons: IStartButtonItem[];
}

export interface IStartButtonItem {
  startButtonName?: string;
  startButtonId: string;
  singleRoxFile: boolean;
}

export interface ISetCorporateDesignRequest {
  ButtonHoverColor: string;
  MainFontColor: string;
  MenuFontColor: string;
  MenuFontHoverColor: string;
  SubMenuColor: string;
  Darkblue: string;
  Warningred: string;
  Logo: string;
}

export interface IGetDocTypesReply extends IBaseReply {
  docTypes: Array<{
    id: number;
    name: string;
  }>;
}

export interface IGetRootFolderReply extends IBaseReply {
  folderId: number;
  name: string;
}

export interface IGetFolderContentRequest extends IBaseRequest {
  folderId: number;
}
export interface IGetFolderContentReply extends IBaseReply {
  folderId: number;
  files: IRoxFile[];
  folders: IRoxFolder[];
}

export interface IGetDocumentRequest {
  roxFileId: number;
  fieldName: string;
  fileName: string;
  instanceId: string;
  versionId: string;
}

export interface IDownloadRoxDocToServerReply extends IBaseReply {
  fieldContents: IFieldContentMap;
}

export interface IDownloadRoxDocToServerRequest extends IBaseRequest {
  instanceId: string;
  fieldContents: IFieldContentMap;
  extVals: ITaskExtensions;
}

export interface IGetDocumentReply extends IBaseReply {
  data: Buffer;
  fileName: string;
}

export interface IGetProcessesForRoxFileRequest {
  roxFileId: number;
}

export interface IGetProcessesForRoxFileReply extends IBaseReply {
  processes: IProcessItem[];
}

export interface IGetProcessesWithGroupRequest {
  groupId: string;
}
export interface IGetProcessesWithGroupReply extends IBaseReply {
  processes: {
    processName: string;
    url: string;
    workspaceId: string;
  }[];
}

export interface IGetProcessesWithUserRequest {
  userId: string;
}
export interface IGetProcessesWithUserReply extends IBaseReply {
  processes: IGetProcessesWithGroupReply["processes"];
}

export interface IEcReleaseFileLockReply {
  LockReleased: boolean;
  ShowMessage: boolean;
  Message?: string;
}

export interface IGetModuleSettingsReply extends IBaseReply {
  currentModule: number;
  refreshinterval: number;
  class?: string;
  mainItems: IModuleSelection[];
}

export interface IGetModulesReply extends IBaseReply {
  modules: IModule[];
}

export interface IGetRoxtraDocumentRequest {
  fileId: number;
}

export interface IGetRightsReply extends IBaseReply {
  applicationAccess: Array<{ id: string; caption: string }>;
  filesystem: IGetRightsReply["applicationAccess"];
}
