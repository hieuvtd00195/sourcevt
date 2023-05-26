import type { CellContext } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import type { FormDateProps } from './ProFormDate';
import ProFormDate from './ProFormDate';
import ProFormDateEdit from './ProFormDateEdit';
import type { FormSelectProps } from './ProFormSelect';
import ProFormSelect from './ProFormSelect';
import type { FormTextFieldProps } from './ProFormTextField';
import ProFormTextField from './ProFormTextField';
import ProFormTextFieldTotal from './ProFormTextFieldTotal';
import ProFormSelectEditAutocomplete, { ProAutoComplete } from './ProFormSelectEditAutocomplete';
import { FieldValues } from 'react-hook-form';

interface Props<T> {
  context: CellContext<T, any>;
  FormTextFieldProps?: Partial<FormTextFieldProps>;
  FormSelectProps?: Partial<FormSelectProps>;
  FormAutocompleteProps?: Partial<ProAutoComplete<FieldValues, string>>,
  FormDateProps?: Partial<FormDateProps>;
  render?: (context: CellContext<T, any>) => ReactNode;
  ref?: any;
  checkTotal?: boolean;
  valueTotal?: any;
  disable?: boolean;
  typeView?: string;
  typeAutoComplete?: boolean;
}

const EditableCell = <T extends object>(props: Props<T>) => {
  const {
    context,
    render,
    FormTextFieldProps,
    FormSelectProps,
    FormDateProps,
    FormAutocompleteProps,
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
  const name = `form.${rowIndex}.${columnId}`;

  const editable =
    typeof updaterOrEdiable === 'function'
      ? updaterOrEdiable(context.row.original)
      : updaterOrEdiable;

  if ((!checkTotal && !editable) || !isEditing) {
    return <Fragment>{render ? render(context) : context.getValue()}</Fragment>;
  }

  switch (type) {
    case 'text':
      if (!checkTotal) {
        return (
          <ProFormTextField
            typeView={typeView}
            disabled={disable}
            name={name}
            {...FormTextFieldProps}
            InputProps={{
              sx: {
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000000',
                },
                '.MuiInputBase-input': { fontWeight: 700 },
              },
            }}
            InputLabelProps={{
              sx: {
                '& .MuiInputBase-input.Mui-disabled': {
                  fontWeight: 700,
                },
              },
            }}
          />
        );
      } else {
        return (
          <ProFormTextFieldTotal
            typeView={typeView}
            valueTotal={valueTotal}
            name={name}
            {...FormTextFieldProps}
          />
        );
      }
    case 'select':
      if (!typeAutoComplete) {
        return <ProFormSelect name={name} {...FormSelectProps} />;
      } else {
        return <ProFormSelectEditAutocomplete name={name} {...FormAutocompleteProps} />;
      }

    case 'date':
      return <ProFormDateEdit name={name} {...FormDateProps} />;
    default:
      return null;
  }
};

export default EditableCell;
