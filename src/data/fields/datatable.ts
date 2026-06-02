import { IFieldConfig } from "../datainterfaces.js";

export interface IDataTableFieldConfig extends IFieldConfig {
  columns: {
    id: string;
    name: string;
    type: "text" | "numeric";
  }[];
  selectionMode: "single" | "multiple";
}

export interface IDataTableFieldValue {
  rows: {
    selected?: boolean;
    data: {
      [field: string]: string | number | Date;
    };
  }[];
  loadError?: "notFound" | "corrupt";
  dataRef?: string;
}

export interface IDataTableFieldReference {
  dataRef: string;
}
