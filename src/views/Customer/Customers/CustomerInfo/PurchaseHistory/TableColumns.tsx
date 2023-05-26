import { Link, Typography } from '@mui/material';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IPurchaseHistory } from 'types/purchaseHistory';

const columnHelper = getColumnHelper<IPurchaseHistory>();

interface Props {
  pageNumber: number;
  pageSize: number;
  totalMoney: number;
}

const HEAD_CELLS: HeadCell<IPurchaseHistory> = {
  id: 'ID',
  type: 'Loại',
  customer: 'Khách hàng',
  products: 'Sản phẩm',
  price: 'Giá',
  quantity: 'SL',
  discount: 'Chiết khấu',
  totalMoney: 'Tổng tiền',
  totalAmountAfterDiscount: 'Tổng tiền sau CK',
};

const useTableColumns = (props: Props) => {
  const { totalMoney } = props;

  const columns: ProColumn<IPurchaseHistory> = useMemo(() => {
    return [
      columnHelper.accessor('billCode', {
        id: 'ID',
        size: 50,
        header: () => HEAD_CELLS.id,
        cell: (context) => (
          <Link
            href={`/warehouse/draft/${context.getValue() || '#'}`}
            target="_blank"
            color="#007bff"
            fontWeight={700}
          >
            {context.getValue()}
          </Link>
        ),
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('billLogType', {
        id: 'type',
        enableSorting: false,
        header: () => HEAD_CELLS.type,
        cell: (context) => {
          if (context.getValue() === 1) {
            return (
              <Typography variant="subtitle2" color="error">
                Trả hàng
              </Typography>
            );
          } else {
            return <Typography variant="subtitle2">Bán hàng</Typography>;
          }
        },
        meta: {
          title: HEAD_CELLS.type,
        },
      }),
      columnHelper.accessor('customerName', {
        id: 'customer',
        enableSorting: false,
        header: () => HEAD_CELLS.customer,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.customer,
        },
      }),
      columnHelper.accessor('productName', {
        id: 'products',
        enableSorting: false,
        header: () => HEAD_CELLS.products,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.products,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.price,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.price,
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.quantity,
        },
      }),
      columnHelper.accessor('discountValue', {
        id: 'discount',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.discount,
        cell: (context) => {
          const { discountUnit } = context.row.original;

          return (
            <Typography variant="subtitle2">
              {discountUnit === 0
                ? context.getValue() + '%'
                : context.getValue()?.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.discount,
        },
      }),
      columnHelper.accessor('preDiscountTotal', {
        id: 'totalMoney',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.totalMoney,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalMoney,
        },
      }),
      columnHelper.accessor('afterDiscountTotal', {
        id: 'totalAmountAfterDiscount',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.totalAmountAfterDiscount,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        footer: (context) => (
          <Typography variant="subtitle2" color="red">
            {totalMoney?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalAmountAfterDiscount,
        },
      }),
    ];
  }, [totalMoney]);
  return { columns };
};

export default useTableColumns;
