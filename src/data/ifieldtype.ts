import { Component } from "react";
import { ActionHandler } from "../actionhandler";
import { IInstanceEnvironment } from "../environment";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { IProcessDetails } from "../process/processinterfaces";
import { IUserDetails } from "../user/userinterfaces";
import { IChartData, IFieldConfig } from "./datainterfaces";
import { IFieldDefinition } from "./ifielddefinition";
import { FieldType, FieldValueType, IFieldValue } from "./ifieldvalue";
import { IFormElementProps } from "./iformelementprops";

export type GetInputParams<ConfigType extends IFieldConfig, ValueType extends FieldValueType> = {
  formElementProps: IFormElementProps<ConfigType, ValueType>;
  instanceEnv: IInstanceEnvironment;
  actionHandler: ActionHandler;
  onFieldValueChanged: () => void;
  showInvalidValue: boolean;
  startEventId?: string;
  hideRequiredIdentifier?: boolean;
};

export interface IFieldType<ConfigType extends IFieldConfig, ValueType extends FieldValueType> {
  getType(): FieldType;
  getName(userLanguage: string): string;
  getInput(params: GetInputParams<ConfigType, ValueType>): JSX.Element | undefined;
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
  ): string | Date | number | undefined;
  renderValueForGrid(fieldName: string, baseGrid: Component, process?: IProcessDetails, user?: IUserDetails): ((props: { dataItem: unknown }) => JSX.Element) | undefined;
  getSettingsButton(
    fieldDefinition: IFieldDefinition,
    onConfigChanged: (fieldDefinition: IFieldDefinition) => void,
    bpmnProcess: BpmnProcess,
    hideLocalSettings: boolean,
  ): JSX.Element | undefined;
  isVisible(): boolean;
  isValid(fieldDefinition: IFieldDefinition, instanceEnv: IInstanceEnvironment): Promise<boolean>;
  isConfigValid(fieldDefinition: IFieldDefinition, userLanguage: string): { valid: boolean; message?: string };
  /**
   * Returns whether this field can be used to display in Dashboard charts for additional modules
   */
  isAvailableAsChartField(): boolean;
  appendValueToChartData(currentChartData: IChartData[], field: IFieldValue): void;
  getValueForInstanceTitle(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails, config?: IFieldConfig): string;
  migrateFieldConfig(newConfig: IFieldConfig, oldConfig: IFieldConfig): void;
  filterCellRender(fieldKey: string, grid: Component): JSX.Element | undefined;
  applyCustomFilter(value: FieldValueType | undefined | null, filter: {}): boolean;
}
