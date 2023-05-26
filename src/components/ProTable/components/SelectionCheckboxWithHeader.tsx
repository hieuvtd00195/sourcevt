import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import type { ColumnDef } from '@tanstack/react-table';

const SelectionCheckboxWithHeader = <T extends object>(name: string) => {
  const component: ColumnDef<T, any> = {
    id: 'selection',
    size: 60,
    maxSize: 60,
    minSize: 60,
    header: name,
    cell: ({ row }) => (
      <Box>
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </Box>
    ),
    meta: {
      title: 'Chọn tất cả',
    },
  };

  return component;
};

export default SelectionCheckboxWithHeader;
