import { GridColumnMenuWrapperProps } from '@progress/kendo-react-grid/dist/npm/columnMenu/GridColumnMenuWrapper';
import * as React from 'react';
/**
 * @hidden
 */
export interface HeaderCellBaseProps {
    columnMenuWrapperProps: GridColumnMenuWrapperProps;
    /**
     * The column field in which the cell is located.
     */
    field?: string;
    /**
     * The title of the column in which the cell is located.
     */
    title?: string;
    /**
     * The `click` event handler of the cell.
     */
    onClick?: any;
    /**
     * The `selectionChange` event handler of the cell.
     */
    selectionChange: any;
    /**
     * The `selectionValue` event handler of the column in which the cell is located.
     */
    selectionValue: any;
    /**
     * A function for overriding the default rendering of the header cell.
     */
    render?: (defaultRendering: React.ReactNode | null, props: HeaderCellBaseProps) => React.ReactNode;
    /**
     * The current sort icons.
     */
    children: React.ReactNode;
}
/**
 * @hidden
 */
export interface HeaderCellProps extends HeaderCellBaseProps {
    /**
     * A function for overriding the default rendering of the header cell.
     */
    render?: (defaultRendering: React.ReactNode | null, props: HeaderCellProps) => React.ReactNode;
}
/**
 * @hidden
 */
export declare function HeaderCell(props: HeaderCellProps): any;
