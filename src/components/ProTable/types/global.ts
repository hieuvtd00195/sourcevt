import type { TableCellProps } from '@mui/material/TableCell';
import '@tanstack/react-table';
import type {
  RowData,
  Row,
  HeaderContext,
  CellContext,
} from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    title?: string;
    info?: string;
    align?: TableCellProps['align'];
    type?: 'text' | 'date' | 'select' | 'img';
    editable?: boolean | ((row: TData) => boolean);
    rowSpan?: (
      context: CellContext<TData, any>,
      rows: Row<TData>[]
    ) => number | null;
    colSpan?: (
      context: HeaderContext<TData, any>,
      rows: Row<TData>[]
    ) => number | null;
    hidden?: boolean | ((row: TData) => boolean);
    required?: boolean;
  }

  interface TableMeta<TData extends RowData> {
    editableRows: Record<string, boolean>;
    toggleEditableRow: (rowId: string) => void;
    startRowEditMode: (rowId: string) => void;
    stopRowEditMode: (rowId: string) => void;
    getIsEdited: (rowId: string) => boolean;
    getIsSomeRowsEdited: () => boolean;
  }
}
