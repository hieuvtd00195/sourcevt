import { Checkbox, CheckboxProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import { AnySchema } from 'yup';
import type { ChangeEvent } from 'types/react';

export interface FormCheckboxProps extends Omit<CheckboxProps, 'name'> {
  validate?: AnySchema;
  name: string;
  disabled?: boolean;
  color?: any;
  onChangeSelect?: (value: boolean) => void;
}

const ProFormCheckbox = (props: FormCheckboxProps) => {
  const { t } = useTranslation();

  const { name, validate, disabled, color, onChangeSelect, ...rest } = props;

  const [checked, setChecked] = useState<boolean>(false);

  const { control, setValue } = useFormContext();
  const {
    field: { value, onBlur, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: validate?.getDefault(),
    rules: { validate: Validation.validate(validate) },
  });

  useEffect(() => {
    setChecked(value);
  }, [value]);

  return (
    <Checkbox
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      color={color}
      {...rest}
    />
  );
};

export default ProFormCheckbox;
