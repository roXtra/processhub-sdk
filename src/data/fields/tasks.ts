import Joi from "joi";

export interface ITasksFieldTask {
  checked: boolean;
  text: string;
}

const ITasksFieldTaskObject: ITasksFieldTask = {
  checked: Joi.boolean().required() as unknown as boolean,
  text: Joi.string().allow("") as unknown as string,
};

export const ITasksFieldTaskSchema = Joi.object(ITasksFieldTaskObject);

export interface ITasksFieldValue {
  tasks: ITasksFieldTask[];
}

const ITasksFieldValueObject: ITasksFieldValue = {
  tasks: Joi.array().items(Joi.object(ITasksFieldTaskObject)).required() as unknown as ITasksFieldTask[],
};

export const ITasksFieldValueSchema = Joi.object(ITasksFieldValueObject);
