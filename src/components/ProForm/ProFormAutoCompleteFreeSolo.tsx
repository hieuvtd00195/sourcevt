import styled from '@emotion/styled';
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
import { useEffect, useState } from 'react';

interface Value<T> {
  value: T;
  label: string;
  key: number;
}

interface Props<O extends FieldValues, V extends string | number | null>
  extends Omit<TextFieldProps, 'name' | 'onSelect'> {
  name: string;
  label?: string;
  options: O[];
  renderLabel: (option: O) => string;
  renderValue: (option: O) => V;
  getOptionDisabled?: (option: V) => boolean;
  onSelect?: (id: V | null | any) => Promise<void> | void;
  placeholder: string;
  actionText?: string; // Like placeholder, but for instruction
  valueSelect?: string;
  setTextSearchValue?: any;
}

const ProFormAutoCompleteFreeSolo = <
  O extends FieldValues,
  V extends string | number
>(
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
    setTextSearchValue,
    required,
    valueSelect,
    ...rest
  } = props;

  const { t } = useTranslation();
  const scrollbar = useScrollbar();
  const { control } = useFormContext();
  const {
    field: { value, ref, onChange, ...others },
    fieldState: { error },
  } = useController({ name, control });

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
    <ProFormLabel name={name} title={label} gutterBottom required={required}>
      <Autocomplete
        id={name}
        disabled={disabled}
        {...(disabled && {
          forcePopupIcon: false,
          readOnly: true,
        })}
        inputValue={value ? value : ""}
        freeSolo
        defaultValue={null}
        options={options?.map(renderValue).filter(Boolean)}
        getOptionLabel={(option) => entries[option]?.label}
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
        sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#000000',
          },
        }}
        getOptionDisabled={getOptionDisabled}
        renderInput={(params) => {
          return (
            <CssTextField
              error={Boolean(error)}
              autoComplete="false"
              inputRef={ref}
              helperText={error?.message && t(error.message)}
              placeholder={disabled ? void 0 : placeholder}
              {...params}
              {...rest}
            />
          );
        }}
        renderOption={(props, option) => {
          const { value, label, key } = entries[option];
          return (
            <Box component="li" {...props} value={value} key={key}>
              <Typography variant="subtitle2">{label}</Typography>
            </Box>
          );
        }}
        {...others}
        value={value in entries ? value : null}
        onInputChange={(_event, value, reason) => {
          onChange(value);
        }}
        onChange={(_event, value, reason) => {
          if (reason === 'clear') {
            if (setTextSearchValue) {
              setTextSearchValue('');
            }
          }
          onChange(value);
          if (value && value in entries) {
            onSelect?.(value);
          } else {
            if (!value) {
              onSelect?.(value);
            }
          }
        }}
      />
    </ProFormLabel>
  );
};

export default ProFormAutoCompleteFreeSolo;
const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: 15,
    color: '#65748B',
    fontFamily: 'Roboto',
    fontWeight: 500,
    '& .MuiInputBase-input': {
      padding: '10px 14px',
    },
  },
});
