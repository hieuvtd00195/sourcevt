import FormControl from '@mui/material/FormControl';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Option {
  value: string | number;
  label: string;
}

interface Props
  extends Omit<FormControlLabelProps, 'control' | 'label' | 'onSelect'> {
  name: string;
  options: Option[];
  row?: RadioGroupProps['row'];
  onSelect?: (value: string | number) => void;
}

const FormRadioGroup = (props: Props) => {
  const { name, options, row, onSelect, ...rest } = props;
  const { t } = useTranslation();

  const [value, setValue] = useState<string | number>('');

  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  return (
    <FormControl error={Boolean(error)}>
      <RadioGroup
        row={row}
        {...field}
        onChange={(event) => {
          field.onChange(event.target.value);
          onSelect?.(event.target.value);
        }}
        value={value ?? field.value}
      >
        {options.map(({ value, label }) => (
          <FormControlLabel
            {...rest}
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
      {error?.message && (
        <FormHelperText variant="standard">{t(error.message)}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormRadioGroup;
