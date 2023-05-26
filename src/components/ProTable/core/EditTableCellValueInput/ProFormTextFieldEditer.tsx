import styled from '@emotion/styled';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Dictionary } from 'types/common';
import Validation from 'utils/Validation';
import { AnySchema } from 'yup';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label?: string;
  interpolation?: Dictionary;
  validate?: AnySchema;
}

const ProFormTextFieldEditer = (props: FormTextFieldProps) => {
  const {
    name,
    placeholder,
    disabled,
    required,
    interpolation,
    label,
    validate,
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
    rules: { validate: Validation.validate(validate) },
  });

  return (
      <CssTextField
        id={name}
        fullWidth
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
        {...rest}
      />
  );
};

export default ProFormTextFieldEditer;
const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {

    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: 700,
    '& .MuiInputBase-input': {
      padding: '9.5px 14px',
    },
  },
});
