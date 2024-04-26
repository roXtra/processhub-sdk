import { IFieldConfig } from "../datainterfaces.js";

export interface IDataTableFieldConfig extends IFieldConfig {
  columns: {
    id: string;
    name: string;
    type: "text" | "numeric";
  }[];
}

export interface IDataTableFieldValue {
  rows: {
    selected?: boolean;
    data: {
      [field: string]: string | number | Date;
    };
  }[];
}
