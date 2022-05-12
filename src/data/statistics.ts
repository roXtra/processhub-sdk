/* Interfaces for statistics */

import Joi from "joi";
import { IUserDetails } from "../user/userinterfaces";

/* eslint-disable @typescript-eslint/naming-convention */
export enum StatisticsAction {
  // Process
  processCreated = 1,
  processEdited = 2,
  processDeleted = 3,

  // Instance
  instanceStarted = 10,
  instanceAborted = 11,
  instanceIncomingMail = 12,
  instanceOutgoingMail = 13,
  instanceJumped = 14,
  instanceCompleted = 15,
  instanceReopened = 16,
  instanceDeleted = 17,

  // Todo
  todoCreated = 20,
  todoCompleted = 21,
  todoUpdated = 22,
  todoExecuted = 23,
  todoWithDecision = 24,
  todoDeleted = 25,

  // User
  userComment = 30,
}
/* eslint-enable @typescript-eslint/naming-convention */

interface IStatisticTrailEntryTodo {
  todoId?: string;
  bpmnTaskId: string;
  bpmnLaneId: string;
  desicionTaskBpmnTaskId?: string;
  timeOverDueDate?: number;
}

const IStatisticTrailEntryTodoObject: IStatisticTrailEntryTodo = {
  todoId: Joi.string().allow("") as unknown as string,
  bpmnTaskId: Joi.string().allow("").required() as unknown as string,
  bpmnLaneId: Joi.string().allow("").required() as unknown as string,
  desicionTaskBpmnTaskId: Joi.string().allow("") as unknown as string,
  timeOverDueDate: Joi.number() as unknown as number,
};

export const IStatisticTrailEntryTodoSchema = Joi.object(IStatisticTrailEntryTodoObject);

interface IStatisticTrailEntryInstance {
  instanceId: string;
  jumpToBpmnTask?: string;
}

const IStatisticTrailEntryInstanceObject: IStatisticTrailEntryInstance = {
  instanceId: Joi.string().allow("").required() as unknown as string,
  jumpToBpmnTask: Joi.string().allow("") as unknown as string,
};

export const IStatisticTrailEntryInstanceSchema = Joi.object(IStatisticTrailEntryInstanceObject);

interface IStatisticTrailEntryUser {
  instanceId: string;
}

const IStatisticTrailEntryUserObject: IStatisticTrailEntryUser = {
  instanceId: Joi.string().allow("").required() as unknown as string,
};

export const IStatisticTrailEntryUserSchema = Joi.object(IStatisticTrailEntryUserObject);

export interface IStatisticTrailEntry {
  todo?: IStatisticTrailEntryTodo;
  instance?: IStatisticTrailEntryInstance;
  user?: IStatisticTrailEntryUser;
  process?: {};
}

const IStatisticTrailEntryObject: IStatisticTrailEntry = {
  todo: IStatisticTrailEntryTodoSchema as unknown as IStatisticTrailEntryTodo,
  instance: IStatisticTrailEntryInstanceSchema as unknown as IStatisticTrailEntryInstance,
  user: IStatisticTrailEntryUserSchema as unknown as IStatisticTrailEntryUser,
  process: Joi.object(),
};

export const IStatisticTrailEntrySchema = Joi.object(IStatisticTrailEntryObject);

export interface IStatisticRow {
  statisticsId: string;
  workspaceId: string;
  processId: string;
  details: IStatisticTrailEntry;
  action: StatisticsAction;
  userDetails?: IUserDetails;
  userId: string;
  createdAt: Date;
}

export type IStatisticsChartDetails = {
  overViewChartImage: string;
  reportBarChartImage: string;
  reportDonutChartImage: string;
  reportDecisionPieImage: string;
  overViewChartSelection: string;
  reportBarChartSelection: string;
  selectedDecision: string;
  editTimeHeatMap: string;
  selectionHeatMap: string;
  overdueHeatMap: string;
};

export const IStatisticsChartsObject: IStatisticsChartDetails = {
  overViewChartImage: Joi.string().allow("").required() as unknown as string,
  reportBarChartImage: Joi.string().allow("").required() as unknown as string,
  reportDonutChartImage: Joi.string().allow("").required() as unknown as string,
  reportDecisionPieImage: Joi.string().allow("").required() as unknown as string,
  overViewChartSelection: Joi.string().allow("").required() as unknown as string,
  reportBarChartSelection: Joi.string().allow("").required() as unknown as string,
  selectedDecision: Joi.string().allow("").required() as unknown as string,
  editTimeHeatMap: Joi.string().allow("").required() as unknown as string,
  selectionHeatMap: Joi.string().allow("").required() as unknown as string,
  overdueHeatMap: Joi.string().allow("").required() as unknown as string,
};
