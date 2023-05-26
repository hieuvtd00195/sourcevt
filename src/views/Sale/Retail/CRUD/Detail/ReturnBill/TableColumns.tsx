import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SouthIcon from '@mui/icons-material/South';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  date: 'Ngày',
  id: 'ID',
  type: 'Loại',
  customer: 'Khách hàng',
  product: 'Sản phẩm',
  price: 'Giá',
  amount: 'SL',
  discount: 'Chiết khấu',
  focus: 'Tiêu điểm',
  totalPrice: 'Tổng tiền',
  note: 'Ghi chú',
};

interface Props {
  pageNumber?: number;
  pageSize?: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('date', {
        id: 'date',
        size: 100,
        header: () => HEAD_CELLS.date,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.date,
        },
      }),
      columnHelper.accessor('id', {
        id: 'id',
        size: 100,
        header: () => HEAD_CELLS.id,
        cell: (context) => (
          <Typography
            variant="subtitle2"
            sx={{ color: '#007bff', cursor: 'pointer' }}
          >
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('type', {
        id: 'type',
        size: 100,
        header: () => HEAD_CELLS.type,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.type,
        },
      }),
      columnHelper.accessor('customer', {
        id: 'customer',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.customer,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.customer,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
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
      columnHelper.accessor('amount', {
        id: 'amount',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.amount,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.amount,
        },
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
      columnHelper.accessor('focus', {
        id: 'focus',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.focus,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.focus,
        },
      }),
      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalPrice,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalPrice,
        },
      }),

      columnHelper.accessor('note', {
        id: 'note',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Ghi chú">
            <NoteAltIcon />
          </Tooltip>
        ),
        cell: (context) => Math.round(Math.random() * 500),
        meta: {
          title: HEAD_CELLS.note,
        },
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
