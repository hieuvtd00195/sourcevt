import styled from '@emotion/styled';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Dictionary } from 'types/common';
import Validation from 'utils/Validation';
import type { AnySchema } from 'yup';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  interpolation?: Dictionary;
  validate?: AnySchema;
  onChangeInput?: (value: string | null) => void;
}

const ProFormTextFiedTrim = (props: FormTextFieldProps) => {
  const {
    name,
    placeholder,
    disabled,
    required,
    interpolation,
    validate,
    defaultValue,
    value,
    onChangeInput,
    ...rest
  } = props;

  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field,
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
      onChange={(e) => {
        field.onChange(e.target.value);
        if (onChangeInput) {
          onChangeInput(e.target.value);
        }
      }}
      onBlur={(e) => field.onChange(e.target.value.trim())}
      value={value ? value : field.value}
      name={name}
      inputRef={field.ref}
      {...rest}
    />
  );
};

export default ProFormTextFiedTrim;

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: 500,
    '& .MuiInputBase-input': {
      padding: '9.5px 14px',
    },
    '& input::placeholder': {
      fontSize: '1rem',
    },
  },
});
