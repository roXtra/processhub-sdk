import { Component } from "react";
import { ActionHandler } from "../actionhandler";
import { IInstanceEnvironment } from "../environment";
import { IInstanceDetails } from "../instance/instanceinterfaces";
import { SeriesType } from "../modules/imodule";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { IProcessDetails } from "../process/processinterfaces";
import { StateProcessDetails } from "../process/processstate";
import { StateUserDetails } from "../user/phclient";
import { IUserDetails } from "../user/userinterfaces";
import { IChartData, IFieldConfig } from "./datainterfaces";
import { IFieldContentMap } from "./ifieldcontentmap";
import { IFieldDefinition } from "./ifielddefinition";
import { FieldType, FieldValueType, IFieldValue } from "./ifieldvalue";
import { IFormElementProps } from "./iformelementprops";
import React from "react";

export type GetInputParams<ConfigType extends IFieldConfig, ValueType extends FieldValueType> = {
  formElementProps: IFormElementProps<ConfigType, ValueType>;
  instanceEnv: IInstanceEnvironment;
  actionHandler: ActionHandler;
  onFieldValueChanged: (newFieldContents: IFieldContentMap) => void;
  showInvalidValue: boolean;
  /* Id of the bpmn element that contains the form of the current field */
  bpmnElementId?: string;
  hideRequiredIdentifier?: boolean;
  disableMentions?: boolean;
  pendingFieldContents: IFieldContentMap;
};

export interface IFieldType<ConfigType extends IFieldConfig, ValueType extends FieldValueType> {
  getType(): FieldType;
  getName(userLanguage: string): string;
  getInput(params: GetInputParams<ConfigType, ValueType>): React.JSX.Element | null;
  renderValue(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): React.JSX.Element | undefined;
  renderValueForEmail(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): React.JSX.Element | undefined;
  /**
   * Render field value for reports
   */
  renderValueForReport(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): React.JSX.Element | undefined;
  /**
   * Render value for comment section (audittrail)
   */
  renderValueForComment(
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
  ): React.JSX.Element | undefined;
  renderValueToString(
    value: {} | undefined,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
  ): string | undefined;
  getGridDataObject(
    field: IFieldValue,
    fieldName: string,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config: IFieldConfig | undefined,
    columnName: string,
    grid: Component,
  ): string | Date | number | undefined;
  renderValueForGrid(
    fieldName: string,
    baseGrid: Component,
    process?: IProcessDetails | StateProcessDetails,
    user?: StateUserDetails | IUserDetails,
  ): ((props: { dataItem: unknown }) => React.JSX.Element) | undefined;
  getSettingsButton(
    fieldDefinition: IFieldDefinition,
    onConfigChanged: (fieldDefinition: IFieldDefinition) => void,
    bpmnProcess: BpmnProcess,
    hideLocalSettings: boolean,
  ): React.JSX.Element | undefined;
  isVisible(): boolean;
  isValid(fieldDefinition: IFieldDefinition, instanceEnv: IInstanceEnvironment, pendingFieldContents: IFieldContentMap | undefined): Promise<boolean>;
  isConfigValid(fieldDefinition: IFieldDefinition, userLanguage: string): { valid: boolean; message?: string };
  /**
   * Returns whether this field can be used to display in Dashboard charts for additional modules
   */
  isAvailableAsChartField(type?: SeriesType): boolean;
  appendValueToChartData(currentChartData: IChartData[], field: IFieldValue): void;
  getValueForInstanceTitle(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails | StateProcessDetails, config?: IFieldConfig): string;
  migrateFieldConfig(newConfig: IFieldConfig, oldConfig: IFieldConfig): void;
  filterCellRender(fieldKey: string, grid: Component): React.JSX.Element | undefined;
  applyCustomFilter(value: FieldValueType | undefined | null, filter: {}): boolean;
}
