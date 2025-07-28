import { Component } from "react";
import { ActionHandler } from "../actionhandler.js";
import { IInstanceEnvironment } from "../environment.js";
import { IInstanceDetails } from "../instance/instanceinterfaces.js";
import { SeriesType } from "../modules/imodule.js";
import { BpmnProcess } from "../process/bpmn/bpmnprocess.js";
import { IProcessDetails } from "../process/processinterfaces.js";
import { StateProcessDetails } from "../process/processstate.js";
import { StateUserDetails } from "../user/phclient.js";
import { IUserDetails } from "../user/userinterfaces.js";
import { IChartData, IFieldConfig } from "./datainterfaces.js";
import { IFieldContentMap } from "./ifieldcontentmap.js";
import { IFieldDefinition } from "./ifielddefinition.js";
import { FieldType, FieldValueType, IFieldValue } from "./ifieldvalue.js";
import { IFormElementProps } from "./iformelementprops.js";
import React from "react";
import { IUpdateInstanceReply } from "../instance/legacyapi.js";

export type SavePendingFieldContentsAction = () => Promise<IUpdateInstanceReply>;

export type GetInputParams<ConfigType extends IFieldConfig, ValueType extends FieldValueType> = {
  formElementProps: IFormElementProps<ConfigType, ValueType>;
  instanceEnv: IInstanceEnvironment;
  actionHandler: ActionHandler;
  /**
   * Update the pending field contents for the form
   * @param newFieldContents - The new field contents to set
   * @param flush - If true, the pending field contents will be saved immediately - otherwise, a debounce will be used
   */
  onFieldValueChanged: (newFieldContents: IFieldContentMap, flush?: boolean) => void;
  showInvalidValue: boolean;
  /* Id of the bpmn element that contains the form of the current field */
  bpmnElementId?: string;
  hideRequiredIdentifier?: boolean;
  disableMentions?: boolean;
  pendingFieldContents: IFieldContentMap;
  savePendingFieldContents: SavePendingFieldContentsAction;
};

export interface IBaseGrid {
  getFieldValueForDataItem(
    dataItem: {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      [key: string]: string | {} | number | undefined;
    },
    fieldName: string,
  ): { fieldValue: IFieldValue | undefined; instance: IInstanceDetails | undefined };
  getFieldDefinitionByName(fieldName: string): IFieldDefinition | undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  spreadSheetMap: Map<string, {}>;
  onSpreadSheetLinkClicked: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => Promise<void>;
}

export interface IFieldType<ConfigType extends IFieldConfig, ValueType extends FieldValueType> {
  getType(): FieldType;
  getName(userLanguage: string): string;
  getInput(params: GetInputParams<ConfigType, ValueType>): React.JSX.Element | null;
  renderValue(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
    showDirect?: boolean,
  ): React.JSX.Element | undefined;
  renderValueForEmail(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
  ): React.JSX.Element | undefined;
  /**
   * Render value for label fields
   */
  renderValueForLabelField(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    value: {} | undefined | null,
    instance: IInstanceDetails,
    process: IProcessDetails | StateProcessDetails,
    user: StateUserDetails | IUserDetails,
    config?: IFieldConfig,
  ): React.JSX.Element | undefined;
  renderValueToString(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    baseGrid: IBaseGrid,
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  getValueForInstanceTitle(value: {} | undefined | null, instance: IInstanceDetails, process: IProcessDetails | StateProcessDetails, config?: IFieldConfig): string;
  migrateFieldConfig(newConfig: IFieldConfig, oldConfig: IFieldConfig): void;
  filterCellRender(fieldKey: string, grid: Component): React.JSX.Element | undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  applyCustomFilter(value: FieldValueType | undefined | null, filter: {}): boolean;
}
