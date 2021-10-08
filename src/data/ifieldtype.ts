import { GridCellProps } from "@progress/kendo-react-grid";
import { Component } from "react";
import { ActionHandler } from "../actionhandler";
import { IInstanceEnvironment } from "../environment";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { IProcessDetails } from "../process/processinterfaces";
import { IUserDetails } from "../user/userinterfaces";
import { IChartData, IFieldConfig } from "./datainterfaces";
import { IFieldDefinition } from "./ifielddefinition";
import { FieldType, IFieldValue } from "./ifieldvalue";
import { IFormElementProps } from "./iformelementprops";

export interface IFieldType {
  getType(): FieldType;
  getName(): string;
  getInput(
    props: IFormElementProps,
    instanceEnv: IInstanceEnvironment,
    actionHandler: ActionHandler,
    onFieldValueChanged: () => void,
    showInvalidFields: boolean,
    startEventId?: string,
  ): JSX.Element | undefined;
  renderValue(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  renderValueForEmail(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  /**
   * Render field value for reports
   */
  renderValueForReport(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): JSX.Element | undefined;
  renderValueToMarkdown(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails, user: IUserDetails, config?: IFieldConfig): string | undefined;
  renderValueToString(value: {} | undefined, instance: IInstanceDetails, process: IProcessDetails, user: IUserDetails, config?: IFieldConfig): string | undefined;
  getGridDataObject(
    field: IFieldValue,
    fieldName: string,
    instance: IInstanceDetails,
    process: IProcessDetails,
    user: IUserDetails,
    config: IFieldConfig | undefined,
    columnName: string,
    grid: Component,
  ): string | Date | undefined;
  renderValueForGrid(fieldName: string, baseGrid: Component): ((props: GridCellProps) => JSX.Element) | undefined;
  getSettingsButton(
    fieldDefinition: IFieldDefinition,
    onConfigChanged: (fieldDefinition: IFieldDefinition) => void,
    bpmnProcess: BpmnProcess,
    hideLocalSettings: boolean,
  ): JSX.Element | undefined;
  isVisible(): boolean;
  isValid(fieldDefinition: IFieldDefinition, instanceEnv: IInstanceEnvironment): Promise<boolean>;
  isConfigValid(fieldDefinition: IFieldDefinition): { valid: boolean; message?: string };
  /**
   * Returns whether this field can be used to display in Dashboard charts for additional modules
   */
  isAvailableAsChartField(): boolean;
  appendValueToChartData(currentChartData: IChartData[], field: IFieldValue): void;
  getValueForInstanceTitle(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails, config?: IFieldConfig): string;
  migrateFieldConfig(newConfig: IFieldConfig, oldConfig: IFieldConfig): void;
}
