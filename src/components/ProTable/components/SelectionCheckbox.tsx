import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import type { ColumnDef } from '@tanstack/react-table';

const SelectionCheckbox = <T extends object>(props: {
  fieldName: keyof T;
  selected: T[];
  setSelected: (value: T[]) => void;
}) => {
  const { fieldName, selected, setSelected } = props;

  const handleChange = (item: T, checked: boolean) => {
    if (checked) {
      setSelected(
        selected.filter((_item) => _item[fieldName] !== item[fieldName])
      );
    } else {
      setSelected([...selected, item]);
    }
  };

  const component: ColumnDef<T, any> = {
    id: 'selection',
    size: 60,
    maxSize: 60,
    minSize: 60,
    header: (info) => (
      <Checkbox
        checked={info.table.getIsAllRowsSelected()}
        indeterminate={info.table.getIsSomeRowsSelected()}
        onChange={info.table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: (context) => {
      const item = context.row.original;
      const { row } = context;

      const checked = Boolean(
        selected.find((_item) => _item[fieldName] === item[fieldName])
      );

      return (
        <Box>
          <Checkbox
            checked={checked}
            onChange={() => handleChange(item, checked)}
          />
        </Box>
      );
    },
    meta: {
      title: 'Chọn tất cả',
      editable: true,
    },
  };

  return component;
};

export default SelectionCheckbox;
