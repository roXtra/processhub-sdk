import Joi from "joi";
import { getLastArrayEntry } from "../tools/array";

export class IFieldConfig {
  conditionExpression: string | undefined;
  conditionBuilderMode?: boolean;
  validationExpression?: string;
}

export const IFieldConfigObject: IFieldConfig = {
  conditionExpression: Joi.string().allow("") as unknown as string,
  conditionBuilderMode: Joi.boolean() as unknown as boolean,
  validationExpression: Joi.string().allow("") as unknown as string,
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
  color: string;
}

// Returns the name of the best fitting Semantic UI icon for the specified file name
export function getFiletypeIcon(filename: string): string {
  if (filename == null || filename.length === 0) return "file outline";

  const extension = getLastArrayEntry(filename.split("."))?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "file pdf outline";
    case "xls":
    case "xlsx":
      return "file excel outline";
    case "doc":
    case "docx":
      return "file word outline";
    case "ppt":
    case "pptx":
      return "file powerpoint outline";
    case "zip":
    case "tar.gz":
      return "file archive outline";
    case "txt":
      return "file text outline";
    case "jpg":
    case "png":
    case "gif":
    case "svg":
      return "file image outline";
    default:
      return "file outline";
  }
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
