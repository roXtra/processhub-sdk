import { State, StateSchema } from "../../instance/instanceinterfaces.js";
import Joi from "joi";

export interface IProcessLinkInstance {
  instanceId: string;
  processId: string;
  workspaceId: string;
  title: string | undefined;
  moduleId: number;
  state: State | undefined;
  processName: string;
}

const IProcessLinkInstanceObject: IProcessLinkInstance = {
  instanceId: Joi.string().allow("").required() as unknown as string,
  workspaceId: Joi.string().allow("").required() as unknown as string,
  processId: Joi.string().allow("").required() as unknown as string,
  title: Joi.string().allow("") as unknown as string,
  moduleId: Joi.number().required() as unknown as number,
  state: StateSchema as unknown as State,
  processName: Joi.string().allow("") as unknown as string,
};

export const IProcessLinkInstanceSchema = Joi.object(IProcessLinkInstanceObject);

export interface IProcessLinkValue {
  linkedInstances: IProcessLinkInstance[];
}

const IProcessLinkValueObject: IProcessLinkValue = {
  linkedInstances: Joi.array().items(Joi.object(IProcessLinkInstanceObject)).required() as unknown as IProcessLinkInstance[],
};

export const IProcessLinkValueSchema = Joi.object(IProcessLinkValueObject);
