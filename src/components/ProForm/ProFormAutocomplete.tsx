import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useScrollbar from 'hooks/useScrollbar';
import type { FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PlaceHolder from './components/PlaceHolder';
import ProFormLabel from './ProFormLabel';

interface Value<T> {
  value: T;
  label: string;
  key: number;
}

interface Props<O extends FieldValues, V extends string | number>
  extends Omit<TextFieldProps, 'name' | 'onSelect'> {
  name: string;
  label?: string;
  options: O[];
  renderLabel: (option: O) => string;
  renderValue: (option: O) => V;
  getOptionDisabled?: (option: V) => boolean;
  onSelect?: (id: V[] | null) => Promise<void> | void;
  placeholder: string;
  actionText?: string; // Like placeholder, but for instruction
}

const ProFormAutocomplete = <O extends FieldValues, V extends string | number>(
  props: Props<O, V>
) => {
  const {
    name,
    label,
    options,
    renderLabel,
    renderValue,
    getOptionDisabled,
    disabled,
    placeholder,
    actionText,
    onSelect,
    ...rest
  } = props;

  const { t } = useTranslation();
  const scrollbar = useScrollbar();

  const { control } = useFormContext();

  const {
    field: { value, onChange, ...others },
    fieldState: { error },
  } = useController({ name, control });

  //Convert Array to object set value!!!! Warning
  const entries = options.reduce<Record<string | number, Value<V>>>(
    (acc, option, i) => {
      const value = renderValue(option);
      const label = renderLabel(option);
      acc[value] = { value, label, key: i };
      return acc;
    },
    {}
  );
  return (
    <ProFormLabel name={name} title={label} gutterBottom>
      <Autocomplete
        id={name}
        disabled={disabled}
        multiple
        {...(disabled && {
          forcePopupIcon: false,
          readOnly: true,
        })}
        options={options.map(renderValue).filter(Boolean)}
        getOptionLabel={(option) => entries[option].label}
        noOptionsText={
          <PlaceHolder>
            {!options.length && actionText
              ? actionText
              : t('Không có lựa chọn')}
          </PlaceHolder>
        }
        componentsProps={{
          paper: {
            elevation: 16,
            sx: scrollbar,
          },
        }}
        getOptionDisabled={getOptionDisabled}
        renderInput={(params) => (
          <TextField
            error={Boolean(error)}
            helperText={error?.message && t(error.message)}
            placeholder={disabled ? void 0 : placeholder}
            {...params}
            {...rest}
          />
        )}
        renderOption={(props, option) => {
          const { value, label, key } = entries[option];
          return (
            <Box component="li" {...props} value={value} key={key}>
              <Typography variant="subtitle2">{label}</Typography>
            </Box>
          );
        }}
        {...others}
        value={value || []}
        onChange={(_event, value) => {
          // if (typeof isValid !== 'function' || isValid(value)) {
          onChange(value);
          onSelect?.(value);
          // }
        }}
      />
    </ProFormLabel>
  );
};

export default ProFormAutocomplete;
