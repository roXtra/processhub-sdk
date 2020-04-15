import { IFieldContentMap } from "../data/datainterfaces";
import { IBaseRequest, IBaseReply } from "../legacyapi/apiinterfaces";
import { IInstanceDetails } from "../instance/instanceinterfaces";

export enum MailSender {
  FromProcessHub,   // Noreply@mail.processhub.com
  FromInstance,     // Use the mail address of the current instance as reply-to
}

export interface ISendMailTemplateRequest extends IBaseRequest {
  instanceUrl?: string;
  todoDescription?: string;
  todoTitle?: string;
  fieldContents?: IFieldContentMap;
  receiverIdOrMails: string[];
  sender?: MailSender;
  instanceId?: string;
  signature?: string;
  subject: string;
  instance: IInstanceDetails;
}

export interface ISendMailTemplateReply extends IBaseReply {
  errorMessage?: string;
}

export interface IReplyToMailRequest extends IBaseRequest {
  sender?: MailSender;
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