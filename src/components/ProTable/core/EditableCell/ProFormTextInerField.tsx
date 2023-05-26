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

interface Props<T> {
  FormTextFieldProps?: Partial<FormTextFieldProps>;
  rowIndex?: number;
  columnId?: string;
  disabled?: boolean;
  typeView?: string;
  multiple?: boolean;
}

const ProFormTextInerField = <T extends object>(props: Props<T>) => {
  const { FormTextFieldProps, rowIndex, columnId, disabled, typeView ,multiple} = props;
  const name = `form.${rowIndex}.${columnId}`;

  return (
    <ProFormTextField
      disabled={disabled}
      typeView={typeView}
      multiple={multiple}
      name={name}
      {...FormTextFieldProps}
    />
  );
};

export default ProFormTextInerField;
