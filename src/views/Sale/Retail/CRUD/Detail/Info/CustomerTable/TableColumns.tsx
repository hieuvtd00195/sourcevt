import SouthIcon from '@mui/icons-material/South';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  id: '#',
  product: 'Sản phẩm',
  amount: 'SL',
  price: 'Giá',
  discount: 'Chiết khấu',
  total: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<any> = useMemo(() => {
    return [
      // Index<any>(pageNumber, pageSize),
      columnHelper.accessor('id', {
        id: 'id',
        size: 100,
        header: () => HEAD_CELLS.id,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 100,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
        },
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        size: 100,
        header: () => HEAD_CELLS.amount,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.amount,
        },
        footer: (context) => <Typography variant="subtitle2">100</Typography>,
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        header: () => HEAD_CELLS.price,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.price,
        },
        footer: (context) => <Typography variant="subtitle2">100</Typography>,
      }),
      columnHelper.accessor('discount', {
        id: 'discount',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Chiết khấu">
            <SouthIcon color="error" />
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.discount,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.total,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.total,
        },
        footer: (context) => <Typography variant="subtitle2">100</Typography>,
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
