import { Checkbox, CheckboxProps } from '@mui/material';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import { AnySchema } from 'yup';

export interface FormCheckboxProps extends Omit<CheckboxProps, 'name'> {
  validate?: AnySchema;
  name: string;
  disabled?: boolean;
  color?: any;
}

const ProFormCheckbox = (props: FormCheckboxProps) => {
  const { t } = useTranslation();

  const { name, validate, disabled, color, ...rest } = props;

  const { control, setValue } = useFormContext();
  const {
    field: { value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: validate?.getDefault(),
    rules: { validate: Validation.validate(validate) },
  });

  return (
    <Checkbox
      name={name}
      checked={value}
      onChange={() => {
        setValue(name, !value);
      }}
      disabled={disabled}
      color={color}
      {...rest}
    />
  );
};

export default ProFormCheckbox;
