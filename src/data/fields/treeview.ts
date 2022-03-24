import Joi from "joi";
import { IFieldConfigDefault, IFieldConfigObject } from "../datainterfaces.js";

/**
 * Represents one TreeView Entry
 */
export interface ITreeViewEntry {
  id: string;
  name: string;
  checked: boolean;
  subItems: ITreeViewEntry[];
}

/**
 * Represents whole TreeView data (also in DB)
 */
export interface ITreeViewFieldValue {
  entries: ITreeViewEntry[];
}

const TreeViewEntryObject: ITreeViewEntry = {
  id: Joi.string() as unknown as string,
  name: Joi.string().allow("") as unknown as string,
  checked: Joi.boolean() as unknown as boolean,
  /* Joi.link("...") creates a link to itself to allow recursive TreeViewEntries
   * "." -> the link
   * ".." -> the subItems array
   * "..." -> the TreeViewEntryObject
   */
  subItems: Joi.array().items(Joi.link("...")).required() as unknown as ITreeViewEntry[],
};

export const TreeViewEntrySchema = Joi.object(TreeViewEntryObject);

const TreeViewFieldValueObject: ITreeViewFieldValue = {
  entries: Joi.array().items(Joi.object(TreeViewEntryObject)).required() as unknown as ITreeViewEntry[],
};

export const TreeViewFieldValueSchema = Joi.object(TreeViewFieldValueObject);

/**
 * TreeView Config Object
 */
export interface ITreeViewFieldConfig extends IFieldConfigDefault<ITreeViewFieldValue> {
  entries: ITreeViewEntry[];
  oneEntryMustBeChecked: boolean;
}

const TreeViewFieldConfigObject: ITreeViewFieldConfig = {
  entries: Joi.array().items(Joi.object(TreeViewEntryObject)).required() as unknown as ITreeViewEntry[],
  oneEntryMustBeChecked: Joi.boolean().required() as unknown as boolean,
  defaultValue: TreeViewFieldValueSchema as unknown as ITreeViewFieldValue,
  ...IFieldConfigObject,
};

export const TreeViewFieldConfigSchema = Joi.object(TreeViewFieldConfigObject);
