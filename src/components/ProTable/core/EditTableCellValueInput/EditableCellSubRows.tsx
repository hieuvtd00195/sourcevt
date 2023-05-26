import type { CellContext } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { FieldValues } from 'react-hook-form';
import ProFormTextField, {
  FormTextFieldProps,
} from './ProFormTextFieldEditer';
import ProFormTextFieldEditer from './ProFormTextFieldEditer';

interface Props<T> {
  context: CellContext<T, any>;
  FormTextFieldProps?: Partial<FormTextFieldProps>;

  render?: (context: CellContext<T, any>) => ReactNode;
  ref?: any;
  checkTotal?: boolean;
  valueTotal?: any;
  disable?: boolean;
  typeView?: string;
  typeAutoComplete?: boolean;
}

const EditableCellSubRows = <T extends object>(props: Props<T>) => {
  const {
    context,
    render,
    FormTextFieldProps,
    checkTotal,
    typeView,
    valueTotal,
    disable,
    typeAutoComplete,
  } = props;
  const rowIndex = context.row.index;
  const rowId = context.row.id;
  const columnId = context.column.id;
  const isEditing = context.table.options.meta?.getIsEdited(rowId);
  const type = context.column.columnDef.meta?.type;
  const updaterOrEdiable = context.column.columnDef.meta?.editable;
  const name = `form.${rowIndex}.subRows.${rowIndex}.${columnId}`;
  
  const editable =
    typeof updaterOrEdiable === 'function'
      ? updaterOrEdiable(context.row.original)
      : updaterOrEdiable;

  if ((!checkTotal && !editable) || !isEditing) {
    return <Fragment>{render ? render(context) : context.getValue()}</Fragment>;
  }
  switch (type) {
    case 'text':
      return (
        <ProFormTextFieldEditer
          disabled={disable}
          name={name}
          {...FormTextFieldProps}
         
        />
      );

    default:
      return null;
  }
};

export default EditableCellSubRows;
