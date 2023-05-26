import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import useNotification from 'hooks/useNotification';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { FiltersRef } from './utils/types';

interface Props {
  onSelect: (billCodes: string[]) => void;
  onDeselect: (billCode: string) => void;
  onClear?: () => void;
  imported: boolean;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSelect, onDeselect, onClear, imported } = props;
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const setNotification = useNotification();

  const handleRemoveOrder = (billCode: string) => {
    setValue((state) => state.filter((value) => value !== billCode));
  };

  const handleReset = () => {
    setValue([]);
    setInputValue('');
  };

  useImperativeHandle(ref, () => ({
    clear: handleRemoveOrder,
    reset: handleReset,
  }));

  return (
    <Box sx={{ p: 2 }}>
      <Autocomplete
        open={open}
        multiple
        freeSolo
        disabled={imported}
        inputValue={inputValue}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        options={[]}
        value={value}
        onChange={(_event, options: string[], reason) => {
          setValue(options);
          if (reason === 'createOption') {
            setOpen(false);
            onSelect?.(options);
          } else if (reason === 'removeOption') {
            const billCodeValue = value.filter((ele) => {
              return !options.includes(ele);
            });
            onDeselect?.(billCodeValue[0]);
          }

          if (reason === 'clear') {
            onClear?.();
          }
        }}
        onInputChange={(_event, valuee) => {
          const input =
            valuee.length > 2 &&
            valuee.charAt(0).match(/[a-z]/i) &&
            valuee.charAt(value.length - 1).match(/[a-z]/i)
              ? valuee.slice(1, -1)
              : valuee;
          if (value.includes(input)) {
            setInputValue('');
            setNotification({
              message: 'Mã vận đơn đã tồn tại',
              severity: 'error',
            });
          } else {
            setInputValue(input);
          }
        }}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => {
            return (
              <Chip
                variant="filled"
                label={option}
                {...getTagProps({ index })}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tìm kiếm đơn hàng"
            placeholder="Nhập thông tin đơn hàng"
            fullWidth
            type={'number'}
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
          />
        )}
      />
    </Box>
  );
});

export default FiltersForm;
