import SouthIcon from '@mui/icons-material/South';
import Tooltip from '@mui/material/Tooltip';
import Index from 'components/ProTable/components/Index';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  id: '#',
  image: 'Ảnh sản phẩm',
  productName: 'Sản phẩm',
  productId: 'Mã sản phẩm',
  price: 'Giá',
  quantity: 'SL',
  inventory: 'Tồn có thể bán',
  payment: 'Thành Tiền',
  discountValue: 'Chiết khấu',
  discountUnit: 'Đơn vị chiết khấu',
  total: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const {pageNumber,pageSize}  = props
  const columns: ProColumn<any> = useMemo(() => {
    return [
      Index<any>(pageNumber, pageSize),
      // columnHelper.accessor('id', {
      //   id: 'id',
      //   size: 100,
      //   header: () => HEAD_CELLS.id,
      //   cell: (context) => context.getValue(),
      //   meta: {
      //     title: HEAD_CELLS.id,
      //   },
      // }),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 100,
        header: () => HEAD_CELLS.productName,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productName,
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 100,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.quantity,
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
      columnHelper.accessor('discountValue', {
        id: 'discountValue',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Chiết khấu">
            <SouthIcon color="error" />
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.discountValue,
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
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
