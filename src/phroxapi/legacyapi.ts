import { IBaseReply, IBaseRequest } from "../legacyapi";
import { IRoxFile, IRoxFolder, IModuleSelection } from ".";
import { Instance } from "..";
import { IFieldContentMap } from "../data";
import { ITaskExtensions } from "../process/processinterfaces";
import { ModuleId } from "../modules";

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
};

export interface IProcessItem {
  processName: string;
  processId: string;
  startButtons: IStartButtonItem[];
}

export interface IStartButtonItem {
  startButtonName: string;
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
  instanceDetails: Instance.IInstanceDetails;
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
    urlName: string;
    workspaceId: string;
  }[];
}

export interface IGetProcessesWitUserRequest {
  userId: string;
}
export interface IGetProcessesWitUserReply extends IBaseReply {
  processes: {
    processName: string;
    urlName: string;
    workspaceId: string;
  }[];
}

export interface IEcReleaseFileLockReply {
  LockReleased: boolean;
  ShowMessage: boolean;
  Message: string;
}

export interface IGetModuleSettingsReply extends IBaseReply {
  currentModule: ModuleId;
  refreshinterval: number;
  class?: string;
  mainItems: IModuleSelection[];
}
