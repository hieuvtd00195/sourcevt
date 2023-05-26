import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IReportRevenueCustomer } from '../utils/type';
import { Typography } from '@mui/material';

interface Props {
  pageNumber: number;
  pageSize: number;
}

const columnHelper = getColumnHelper<IReportRevenueCustomer>();

const HEAD_CELLS: HeadCell<IReportRevenueCustomer> = {
  id: '#',
  customer: 'Khách hàng',
  phoneNumber: 'Điện thoại',
  order: 'Đơn hàng',
  bills: 'Hóa đơn mua',
  totalPurchase: 'Tổng mua',
  returnInvoice: 'Hóa đơn trả',
  totalReturn: 'Tổng trả',
  productsPurchased: 'Sản phẩm mua',
  productsReturned: 'Sản phẩm trả',
  accumulatedPoints: 'Điểm tích lũy',
  usedPoints: 'Điểm sử dụng',
  discount: 'Chiết khấu',
  revenue: 'Doanh thu',
  price: 'Giá vốn',
  profit: 'Lợi nhuận',
};

const useTableColumns = (props: Props) => {
  const columns: ProColumn<IReportRevenueCustomer> = useMemo(() => {
    return [
      // Index<Customer>(pageNumber, pageSize),
      columnHelper.accessor('id', {
        id: 'ID',
        size: 55,
        header: () => HEAD_CELLS.id,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.id,
          align: 'center',
        },
      }),
      columnHelper.accessor('customer', {
        id: 'customer',
        size: 200,
        header: () => HEAD_CELLS.customer,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.customer,
          align: 'center',
        },
      }),
      columnHelper.accessor('phoneNumber', {
        id: 'phoneNumber',
        size: 150,
        header: () => HEAD_CELLS.phoneNumber,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.phoneNumber,
          align: 'center',
        },
      }),
      columnHelper.accessor('order', {
        id: 'order',
        size: 60,
        header: () => HEAD_CELLS.order,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000913' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.order,
          align: 'center',
        },
      }),
      columnHelper.accessor('bills', {
        id: 'bills',
        size: 60,
        header: () => HEAD_CELLS.bills,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.bills,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPurchase', {
        id: 'totalPurchase',
        size: 80,
        header: () => HEAD_CELLS.totalPurchase,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalPurchase,
          align: 'center',
        },
      }),
      columnHelper.accessor('returnInvoice', {
        id: 'returnInvoice',
        size: 80,
        header: () => HEAD_CELLS.returnInvoice,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.returnInvoice,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalReturn', {
        id: 'totalReturn',
        size: 80,
        header: () => HEAD_CELLS.totalReturn,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000913' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalReturn,
          align: 'center',
        },
      }),
      columnHelper.accessor('productsPurchased', {
        id: 'productsPurchased',
        size: 80,
        header: () => HEAD_CELLS.productsPurchased,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000913' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.productsPurchased,
          align: 'center',
        },
      }),
      columnHelper.accessor('productsReturned', {
        id: 'productsReturned',
        size: 80,
        header: () => HEAD_CELLS.productsReturned,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.productsReturned,
          align: 'center',
        },
      }),
      columnHelper.accessor('accumulatedPoints', {
        id: 'accumulatedPoints',
        size: 60,
        header: () => HEAD_CELLS.accumulatedPoints,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000913' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.accumulatedPoints,
          align: 'center',
        },
      }),
      columnHelper.accessor('usedPoints', {
        id: 'usedPoints',
        size: 60,
        header: () => HEAD_CELLS.usedPoints,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.usedPoints,
          align: 'center',
        },
      }),
      columnHelper.accessor('discount', {
        id: 'discount',
        size: 85,
        header: () => HEAD_CELLS.discount,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.discount,
          align: 'center',
        },
      }),
      columnHelper.accessor('revenue', {
        id: 'revenue',
        size: 85,
        header: () => HEAD_CELLS.revenue,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.revenue,
          align: 'center',
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 65,
        header: () => HEAD_CELLS.price,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.price,
          align: 'center',
        },
      }),
      columnHelper.accessor('profit', {
        id: 'profit',
        size: 150,
        header: () => HEAD_CELLS.profit,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.profit,
          align: 'center',
        },
      }),
    ];
  }, []);
  return { columns };
};

export default useTableColumns;
