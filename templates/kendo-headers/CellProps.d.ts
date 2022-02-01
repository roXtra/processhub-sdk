import * as React from 'react';
/**
 * @hidden
 */
export interface CellProps {
    dataIndex: number;
    /**
     * @hidden
     */
    id: string;
    /**
     * The index to be applied to the `aria-colindex` attribute.
     */
    ariaColumnIndex: number;
    /**
     * Indicates if the cell is selected.
     */
    isSelected: boolean;
    /**
     * The expanded value of the cell.
     */
    expanded?: boolean;
    /**
     * The custom CSS classes of the cells.
     */
    className?: string;
    /**
     * The styles for the cell.
     */
    style?: React.CSSProperties;
    /**
     * The field to which the cell is bound.
     */
    field?: string;
    /**
     * The data item which corresponds to the current row.
     */
    dataItem: any;
    /**
     * The format that is applied to the value before the value is displayed.
     * Takes the `{0:format}` form where `format` is a standard number format, a custom number format,
     * a standard date format, or a custom date format. For more information on the supported date and number formats,
     * refer to the [kendo-intl](https://github.com/telerik/kendo-intl/blob/develop/docs/index.md) documentation.
     */
    format?: string;
    /**
     * The column span of the cell.
     */
    colSpan?: number;
    /**
     * The event that is fired when the cell is selected.
     */
    selectionChange?: (event: {
        syntheticEvent: React.SyntheticEvent<any>;
    }) => void;
    /**
     * The event that is fired when the cell value is changed.
     */
    onChange?: (event: {
        dataIndex: number;
        dataItem: any;
        syntheticEvent: React.SyntheticEvent<any>;
        field?: string;
        value?: any;
    }) => void;
    /**
     * A function for overriding the default rendering of the cell.
     */
    render?: (defaultRendering: React.ReactElement<HTMLTableCellElement> | null, props: CellProps) => React.ReactElement<HTMLTableCellElement> | null;
}
