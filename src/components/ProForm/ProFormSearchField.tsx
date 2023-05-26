import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { memo, useState } from 'react';
import { useDebounce } from 'react-use';
import type { ChangeEvent, KeyDownEvent } from 'types/react';
import ProFormLabel from './ProFormLabel';

interface Props {
  name: string;
  label: string;
  placeHolder: string;
  onSearch: (searchValue: string) => void;
  searchText: string;
  disabled?: boolean;
}

const ProFormSearchField = (props: Props) => {
  const { name, label, searchText, placeHolder, onSearch, disabled } = props;
  const [value, setValue] = useState<string>('');

  const handleChange: ChangeEvent = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown: KeyDownEvent = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSearch(value);
    }
  };

  useDebounce(
    () => {
      if (searchText !== value) {
        onSearch(value);
      }
    },
    350,
    [searchText, value]
  );

  return (
    <ProFormLabel name={name} title={label} gutterBottom>
      <TextField
        id={name}
        fullWidth
        placeholder={placeHolder}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon fontSize="medium" />
            </InputAdornment>
          ),
          sx: { background: 'white' },
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </ProFormLabel>
  );
};

export default memo(ProFormSearchField);
