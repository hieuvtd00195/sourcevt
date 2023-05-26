import styled from '@emotion/styled';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Dictionary } from 'types/common';
import Validation from 'utils/Validation';
import type { AnySchema } from 'yup';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  interpolation?: Dictionary;
  validate?: AnySchema;
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
    ...rest
  } = props;

  const { t } = useTranslation();

  const { control } = useFormContext();

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
      value={value || ''}
      name={name}
      inputRef={ref}
      {...rest}
    />
  );
};

export default ProFormTextField;

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    color: "#000000",
    fontFamily: "Roboto",
    fontWeight: 500,
    '& .MuiInputBase-input': {
      padding: '9.5px 14px'
    },
  },
});
