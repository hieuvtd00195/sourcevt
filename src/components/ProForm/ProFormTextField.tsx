import styled from '@emotion/styled';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Dictionary } from 'types/common';
import ProFormLabel from './ProFormLabel';
import Validation from 'utils/Validation';
import { AnySchema } from 'yup';

interface Props extends Omit<TextFieldProps, 'name'> {
  name: string;
  label?: string;
  interpolation?: Dictionary;
  validate?: AnySchema;
}

const ProFormTextField = (props: Props) => {
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
    <ProFormLabel name={name} title={label} required={required} gutterBottom>
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
        value={value || ''}
        name={name}
        inputRef={ref}
        {...rest}
      />
    </ProFormLabel>
  );
};

export default ProFormTextField;
const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    color: '#65748B',
    fontFamily: 'Roboto',
    fontWeight: 500,
    '& .MuiInputBase-input': {
      padding: '9.5px 14px',
    },
  },
});
