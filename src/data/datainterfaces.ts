import Joi from "joi";

export const NestedFieldPropsTypes: { Question: "Question" } = { Question: "Question" };

export type NestedFieldProps = { type: typeof NestedFieldPropsTypes.Question; questionId: string };

export const NestedFieldPropsObject: NestedFieldProps = {
  type: Joi.string().valid(NestedFieldPropsTypes.Question).required() as unknown as typeof NestedFieldPropsTypes.Question,
  questionId: Joi.alternatives().conditional("type", { is: NestedFieldPropsTypes.Question, then: Joi.string().required() }) as unknown as string,
};

export const NestedFieldPropsSchema = Joi.object(NestedFieldPropsObject);

export interface IFieldConfig {
  conditionExpression: string;
  conditionBuilderMode: boolean;
  validationExpression: string;
  validationBuilderMode: boolean;
  nestedFieldProps?: NestedFieldProps;
}

export function convertFieldConfig(config: IFieldConfig): IFieldConfig {
  const { conditionBuilderMode, conditionExpression, validationExpression, validationBuilderMode } = config;
  config.conditionBuilderMode = typeof conditionBuilderMode !== "undefined" ? conditionBuilderMode : true;
  config.conditionExpression = typeof conditionExpression !== "undefined" ? conditionExpression : "";
  config.validationExpression = typeof validationExpression !== "undefined" ? validationExpression : "";
  config.validationBuilderMode = typeof validationBuilderMode !== "undefined" ? validationBuilderMode : !(validationExpression != null && validationExpression.length > 0);
  return config;
}

export const IFieldConfigObject: IFieldConfig = {
  conditionExpression: Joi.string().allow("").required() as unknown as string,
  conditionBuilderMode: Joi.boolean().required() as unknown as boolean,
  validationExpression: Joi.string().allow("").required() as unknown as string,
  validationBuilderMode: Joi.boolean().required() as unknown as boolean,
  nestedFieldProps: NestedFieldPropsSchema as unknown as NestedFieldProps,
};

export const IFieldConfigSchema = Joi.object(IFieldConfigObject);

export interface ITaskIdRequiredFieldsNeeded {
  taskId: string;
  requiredFieldsNeeded: boolean;
}

const ITaskIdRequiredFieldsNeededObject: ITaskIdRequiredFieldsNeeded = {
  taskId: Joi.string().allow("").required() as unknown as string,
  requiredFieldsNeeded: Joi.boolean().required() as unknown as boolean,
};

export const ITaskIdRequiredFieldsNeededSchema = Joi.object(ITaskIdRequiredFieldsNeededObject);

export interface IServiceActionConfigField {
  key: string;
  type: string;
  value: string;
}

const IServiceActionConfigFieldObject: IServiceActionConfigField = {
  key: Joi.string().allow("").required() as unknown as string,
  type: Joi.string().allow("").required() as unknown as string,
  value: Joi.string().allow("").required() as unknown as string,
};

export const IServiceActionConfigFieldSchema = Joi.object(IServiceActionConfigFieldObject);

export interface IFieldConfigDefault<ValueType> extends IFieldConfig {
  defaultValue: ValueType | undefined;
}

export interface IChartData {
  label: string;
  number: number;
  color?: string;
}

export interface IHeatmapDatapoint {
  bpmnElementId: string;
  value: number;
}

const IHeatmapDatapointObject: IHeatmapDatapoint = {
  bpmnElementId: Joi.string().allow("").required() as unknown as string,
  value: Joi.number().required() as unknown as number,
};

export const IHeatmapDatapointSchema = Joi.object(IHeatmapDatapointObject);
