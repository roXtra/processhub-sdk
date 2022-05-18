import { FieldType } from "../data/ifieldvalue";

type KendoSeriesType =
  | "area"
  | "bar"
  | "boxPlot"
  | "bubble"
  | "bullet"
  | "candlestick"
  | "column"
  | "donut"
  | "funnel"
  | "heatmap"
  | "horizontalWaterfall"
  | "line"
  | "ohlc"
  | "pie"
  | "polarArea"
  | "polarLine"
  | "polarScatter"
  | "radarArea"
  | "radarColumn"
  | "radarLine"
  | "rangeArea"
  | "rangeBar"
  | "rangeColumn"
  | "scatter"
  | "scatterLine"
  | "verticalArea"
  | "verticalBoxPlot"
  | "verticalBullet"
  | "verticalLine"
  | "verticalRangeArea"
  | "waterfall";

type CustomSeriesType = "scheduler";

export type SeriesType = KendoSeriesType | CustomSeriesType;

// Must match the values defined in Enums_Module.cs in Roxtra.DataProvider
export enum ModuleId {
  None = 0,
  Processes = 1,
  Risks = 2,
  Documents = 3,
  User = 4,
  System = 5,
  Module = 6,
}

export type ModuleName = "documents" | "processes" | "risks" | "user" | "system" | "action" | "action_basic" | "audit" | "reclamations";

export interface IModule {
  id: number;
  moduleType: ModuleId;
  // Name of module sub type if moduleType === ModuleId.Module; (eg "audit" or "action")
  name: ModuleName;
  urlPrefix: string;
  // Title of the module, will be displayed to the user (eg "Maßnahmen")
  title: string;
  processName?: string;
}

export type SchedulerDateFieldConfig = { name: string; dateRangeFieldOption?: "start" | "end" };

export type SchedulerType = { type: "scheduler"; startField?: SchedulerDateFieldConfig; endField?: SchedulerDateFieldConfig };

export type ChartType = { type: KendoSeriesType; stack?: boolean } | SchedulerType;

export interface IGenericModuleChartField {
  fieldName: string;
  type: FieldType;
  chartType: ChartType;
}

export interface IGenericModuleSettings {
  defaultStatusField: string | undefined;
  chartFields?: IGenericModuleChartField[];
}
