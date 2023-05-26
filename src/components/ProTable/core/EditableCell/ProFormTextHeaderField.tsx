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
import ProFormTextFieldValidate from './ProFormTextFieldValidate';

interface Props<T> {
  FormTextFieldProps?: Partial<FormTextFieldProps>;
  rowIndex?: number;
  columnId?: string;
  disabled?: boolean;
  typeView?: string;
  placeholder?: string;
  style?: any;
}

const ProFormTextHeaderField = <T extends object>(props: Props<T>) => {
  const {
    FormTextFieldProps,
    rowIndex,
    columnId,
    disabled,
    typeView,
    placeholder,
    style,
  } = props;
  const name = `${columnId}`;

  return (
    <ProFormTextFieldValidate
      style={style}
      disabled={disabled}
      typeView={typeView}
      placeholder={placeholder}
      name={name}
      {...FormTextFieldProps}
    />
  );
};

export default ProFormTextHeaderField;
