import type { CellContext } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { FieldValues } from 'react-hook-form';
import ProFormTextField, { FormTextFieldProps } from './ProFormTextFieldEditer';
import ProFormTextFieldEditer from './ProFormTextFieldEditer';
import ProFormTextFieldTotal from '../EditableCell/ProFormTextFieldTotal';
import ProFormTextTotalNotRerender from '../EditableCell/ProFormTextTotalNotRerender';

interface Props<T> {
  context: CellContext<T, any> | any;
  FormTextFieldProps?: Partial<FormTextFieldProps>;

  render?: (context: CellContext<T, any>) => ReactNode;
  ref?: any;
  checkTotal?: boolean;
  valueTotal?: any;
  disable?: boolean;
  typeView?: string;
  typeAutoComplete?: boolean;
}

const EditTableCellValueInput = <T extends object>(props: Props<T>) => {
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
  const parentRowIndex = context.row.original?.parentIndex
  const rowId = context.row.id;
  const columnId = context.column.id;
  const isEditing = context.table.options.meta?.getIsEdited(rowId);
  const type = context.column.columnDef.meta?.type;
  const updaterOrEdiable = context.column.columnDef.meta?.editable;
  const originalSubRows = context.row.originalSubRows;
  const name = `form.${rowIndex}.${columnId}`;
  const subName = `form.${parentRowIndex}.productChildren.${rowIndex}.${columnId}`;
  const editable =
    typeof updaterOrEdiable === 'function'
      ? updaterOrEdiable(context.row.original)
      : updaterOrEdiable;
  if (!subName) {
    if (!editable || !isEditing) {
      return (
        <Fragment>{render ? render(context) : context.getValue()}</Fragment>
      );
    }
  } else {
    if (!editable) {
      return (
        <Fragment>{render ? render(context) : context.getValue()}</Fragment>
      );
    }
  }
  
  

  switch (type) {
    case 'text':
      if (!checkTotal) {
        if (originalSubRows) {
          return (
            <ProFormTextFieldEditer
              disabled={disable}
              name={name}
              {...FormTextFieldProps}
            />
          );
        } else {
          return (
            <ProFormTextFieldEditer
              disabled={disable}
              name={subName}
              {...FormTextFieldProps}
            />
          );
        }
      } else {
        if (originalSubRows) {
          return (
            <ProFormTextTotalNotRerender
              typeView={typeView}
              valueTotal={valueTotal}
              name={name}
              {...FormTextFieldProps}
            />
          );
        }else{
          return (
            <ProFormTextTotalNotRerender
              typeView={typeView}
              valueTotal={valueTotal}
              name={subName}
              {...FormTextFieldProps}
            />
          );
        }
  
      }
    default:
      return null;
  }
};

export default EditTableCellValueInput;
