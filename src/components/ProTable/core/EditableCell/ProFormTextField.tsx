import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Dictionary } from 'types/common';
import Validation from 'utils/Validation';
import type { AnySchema, string } from 'yup';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  interpolation?: Dictionary;
  validate?: AnySchema;
  ref?: any;
  disabled?: boolean;
  typeView?: string;
  multiple?: boolean;
}

const ProFormTextField = (props: FormTextFieldProps) => {
  const {
    name,
    placeholder,
    disabled,
    required,
    interpolation,
    validate,
    defaultValue,
    typeView,
    ref: newRef,
    multiple,
    ...rest
  } = props;

  const { t } = useTranslation();

  const { control, getValues } = useFormContext();
  const {
    field: { value, ref, onBlur, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: validate ? validate.getDefault() : defaultValue,
    rules: { validate: Validation.validate(validate) },
  });

  return (
    <TextField
      id={name}
      required={required}
      error={Boolean(error)}
      helperText={error?.message && t(error.message, interpolation)}
      placeholder={disabled ? void 0 : placeholder}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={getValues(name) ? getValues(name) : value || ''}
      name={name}
      inputRef={ref}
      multiline={multiple ? true : false}
      InputProps={
        multiple
          ? {
              sx: {
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor:
                    typeView === 'detail' ? '#000000 !important' : 'gainsboro',
                },
                '.MuiInputBase-input': {
                  fontWeight:  'normal',
                  fontSize: 14
                },
              },
            }
          : {
              sx: {
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor:
                    typeView === 'detail' ? '#000000 !important' : 'gainsboro',
                },
                '.MuiInputBase-input': {
                  fontWeight: typeView === 'detail' ? 700 : 500,
                },
              },
            }
      }
      InputLabelProps={{
        sx: {
          '& .MuiInputBase-input.Mui-disabled': {
            fontWeight: typeView === 'detail' ? 700 : 500,
          },
        },
      }}
      {...rest}
    />
  );
};

export default ProFormTextField;
