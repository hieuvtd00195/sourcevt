import DeleteIcon from '@mui/icons-material/Delete';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Checkbox, IconButton, TextField } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  inDebt: 'Nợ',
  product: 'Sản phẩm',
  amount: 'SL',
  price: 'Giá',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('inDebt', {
        id: 'inDebt',
        size: 50,
        header: () => HEAD_CELLS.inDebt,
        cell: (context) => <Checkbox />,
        meta: {
          title: HEAD_CELLS.inDebt,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 30,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
        },
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        size: 100,
        header: () => HEAD_CELLS.amount,
        cell: (context) => <TextField id="outlined-basic" variant="outlined" />,
        meta: {
          title: HEAD_CELLS.amount,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        header: () => HEAD_CELLS.price,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.price,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => (
          <IconButton>
            <DeleteIcon sx={{ color: 'text.secondary', ml: 1 }} />
          </IconButton>
        ),
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
