import styled from '@emotion/styled';

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
}

const ProFormTextFieldValidate = (props: FormTextFieldProps) => {
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
    ...rest
  } = props;

  const { t } = useTranslation();

  const { control, getValues,register } = useFormContext();
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
    <CssTextField
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

      InputProps={{
        sx: {
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor:
              typeView === 'detail' ? '#000000 !important' : 'gainsboro',
          },
          '.MuiInputBase-input': {
            fontWeight: typeView === 'detail' ? 700 : 500,
          },
        },
      }}
      InputLabelProps={{
        sx: {
          '& .MuiInputBase-input.Mui-disabled': {
            fontWeight: typeView === 'detail' ? 700 : 500,
          },
        },
      }}
      FormHelperTextProps={{style: {width: 100, marginRight: 0, marginLeft: 0, marginBottom: 0}}}
      {...rest}
    />
  );
};
const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: 15,
    color: '#121828',
    fontFamily: 'Roboto',
    // fontWeight: 500,
    '& .MuiInputBase-input': {
    //   padding: '10px 2px',
    },
    '& MuiFormHelperText-root.Mui-error': {
    //   margin: 0,
    //   width: 100,
    },
    '& .MuiInputBase-input.Mui-disabled': {
    //   WebkitTextFillColor: '#000000',
      // background: 'white',
      // borderColor: 'white',
      // textAlign: 'right',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      // borderColor: 'white',
    },
  },
});

export default ProFormTextFieldValidate;
