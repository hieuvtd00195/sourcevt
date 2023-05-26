import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateFormat } from 'constants/locale';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ProFormLabel from './ProFormLabel';
import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Props {
  name: string;
  label?: string;
  onSelect?: (date: Date | null) => void;
  TextFieldProps?: TextFieldProps;
  shouldDisableDate?: (date: Date | null) => boolean;
  DatePickerProps?: Partial<DatePickerProps<Date, Date>>;
  type: 'start' | 'end';
  disabled?: boolean;
  required?: boolean;
  max?: boolean;
  valueMax?: Date;
  placeholder?: string;
}

const ProFormDate = (props: Props) => {
  const {
    name,
    label,
    type,
    disabled,
    required,
    onSelect,
    TextFieldProps,
    DatePickerProps,
    shouldDisableDate,
    max,
    valueMax,
    placeholder,
  } = props;

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const OpenPickerIcon = type === 'start' ? TodayIcon : EventIcon;

  return (
    <ProFormLabel name={name} title={label} required={required} gutterBottom>
      <DatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disabled={disabled}
        inputFormat={DateFormat}
        maxDate={max ? valueMax : undefined}
        PaperProps={{
          sx: {
            '& button.MuiPickersDay-root': {
              borderRadius: 1,
            },
            '& button.MuiPickersDay-root.Mui-disabled': {
              opacity: 0.3, // Fix later
            },
            '& .Mui-disabled': {
              color: max ? 'grey !important' : 'gainsboro',
            },
          },
        }}
        renderInput={(props) => {
          const { inputProps = {}, ...rest } = props;
          if (disabled) {
            inputProps.placeholder = void 0;
          }
          return (
            <TextField
              inputProps={{
                ...inputProps,
                placeholder: placeholder || inputProps.inputProps,
              }}
              
              {...rest}
              {...TextFieldProps}
              fullWidth
              size="small"
              error={Boolean(error)}
              onClick={(e) => setOpen(true)}
              helperText={error?.message && t(error.message)}
              id={name}
              InputProps={{
                sx: {
                  '& .MuiOutlinedInput-input': {
                    cursor: 'pointer',
                  },
                  // '.MuiInputBase-input': { fontWeight: 700 },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon />
                  </InputAdornment>
                ),
              }}
            />
          );
        }}
        components={{
          OpenPickerIcon: disabled ? () => null : OpenPickerIcon,
        }}
        componentsProps={{
          actionBar: { actions: ['today'] },
        }}
        shouldDisableDate={shouldDisableDate}
        dayOfWeekFormatter={(day) => `${day}`}
        InputAdornmentProps={{
          position: 'end',
        }}
        onChange={(date: Date | null) => {
          onChange(date);
          onSelect?.(date);
        }}
        value={value || ''}
        {...DatePickerProps}
      />
    </ProFormLabel>
  );
};

export default ProFormDate;
