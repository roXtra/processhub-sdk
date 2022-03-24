import { IBaseRequest, IBaseReply } from "../legacyapi/apiinterfaces.js";
import { IInstanceDetails } from "../instance/instanceinterfaces.js";
import { IFieldContentMap } from "../data/ifieldcontentmap.js";

export interface ISendMailTemplateRequest extends IBaseRequest {
  instanceUrl?: string;
  todoDescription?: string;
  todoTitle?: string;
  fieldContents?: IFieldContentMap;
  receiverIdOrMails: string[];
  instanceId?: string;
  signature?: string;
  subject: string;
  instance: IInstanceDetails;
}

export interface ISendMailTemplateReply extends IBaseReply {
  errorMessage?: string;
}

export interface IReplyToMailRequest extends IBaseRequest {
  instanceUrl?: string;
  choosenFieldContents: string[];
  subject: string;
  receiverMails: string[];
  addReceiverAsFollower: boolean;
  mailText: string;
  instanceId: string;
  instance: IInstanceDetails;
}

export interface IReplyToMailReply extends IBaseReply {
  errorMessage?: string;
}
