import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Box, Link, Stack, Typography } from '@mui/material';
import DateTime from 'utils/DateTime';
import type { ByProduct, Customer } from './utils/type';

const columnHelper = getColumnHelper<ByProduct>();

const HEAD_CELLS: HeadCell<ByProduct> = {
  index: 'STT',
  customer: 'Khách hàng',
  product: 'Sản phẩm',
  price: 'Giá bán',
  sellNumber: 'SL bán',
  return: 'Trả lại',
  discount: 'Chiết khấu',
  revenue: 'Doanh thu',
  costPrice: 'Giá vốn',
  profit: 'Lợi nhuận',
  purchaseDate: 'Ngày mua cuối',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditNote: (id: number, note: string) => void;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<ByProduct> = useMemo(() => {
    return [
      columnHelper.group({
        id: 'customer',
        header: 'Khách hàng',
        columns: [
          columnHelper.accessor('customer', {
            id: 'customer',
            size: 200,
            enableSorting: false,
            header: () => '[1]',
            cell: (context) => {
              const rowIndex = context.row.index;
              if (rowIndex === 0) {
                return (
                  <Typography variant="subtitle1" fontWeight={500}>
                    {context.getValue<Customer>().name}
                  </Typography>
                );
              } else {
                return (
                  <Stack direction="column">
                    <Box>{context.getValue<Customer>().name}</Box>
                    <Box>{context.getValue<Customer>().phone}</Box>
                  </Stack>
                );
              }
            },
            meta: {
              title: HEAD_CELLS.customer,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'product',
        header: 'Sản phẩm',
        columns: [
          columnHelper.accessor('product', {
            id: 'product',
            size: 200,
            enableSorting: false,
            header: () => '[5]',
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.product,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'price',
        header: 'Giá bán',
        columns: [
          columnHelper.accessor('price', {
            id: 'price',
            enableSorting: false,
            header: () => '[6]',
            cell: (context) => {
              if (context.row.index === 0) {
                return '';
              }
              return Numeral.price(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.price,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'sellNumber',
        header: 'SL bán',
        columns: [
          columnHelper.accessor('sellNumber', {
            id: 'sellNumber',
            enableSorting: false,
            header: () => '[7]',
            cell: (context) => {
              const rowIndex = context.row.index;
              if (rowIndex === 0) {
                return (
                  <Typography variant="subtitle1" fontWeight={500}>
                    {Numeral.price(context.getValue())}
                  </Typography>
                );
              }
              return (
                <Link href="#" target="_blank" color="#2196F3">
                  {Numeral.price(context.getValue())}
                </Link>
              );
            },
            meta: {
              title: HEAD_CELLS.price,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'return',
        header: 'Trả lại',
        columns: [
          columnHelper.accessor('return', {
            id: 'return',
            enableSorting: false,
            header: () => '[8]',
            cell: (context) => {
              const rowIndex = context.row.index;
              if (rowIndex === 0) {
                return (
                  <Typography variant="subtitle1" fontWeight={500}>
                    {Numeral.price(context.getValue())}
                  </Typography>
                );
              }
              return (
                <Link href="#" target="_blank" color="#2196F3">
                  {Numeral.price(context.getValue())}
                </Link>
              );
            },
            meta: {
              title: HEAD_CELLS.return,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'discount',
        header: 'Chiết khấu',
        columns: [
          columnHelper.accessor('discount', {
            id: 'discount',
            enableSorting: false,
            header: () => '[9]',
            cell: (context) => {
              const rowIndex = context.row.index;
              if (rowIndex === 0) {
                return (
                  <Typography variant="subtitle1" fontWeight={500}>
                    {Numeral.price(context.getValue())}
                  </Typography>
                );
              }
              return Numeral.price(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.discount,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'revenue',
        header: 'Lợi nhuận',
        columns: [
          columnHelper.accessor('revenue', {
            id: 'revenue',
            enableSorting: false,
            header: () => '[10]',
            cell: (context) => {
              const rowIndex = context.row.index;
              if (rowIndex === 0) {
                return (
                  <Typography variant="subtitle1" fontWeight={500}>
                    {Numeral.price(context.getValue())}
                  </Typography>
                );
              }
              return Numeral.price(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.revenue,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'costPrice',
        header: 'Giá vốn',
        columns: [
          columnHelper.accessor('costPrice', {
            id: 'costPrice',
            enableSorting: false,
            header: () => '[11]',
            cell: (context) => {
              if (context.row.index === 0) {
                return '';
              }
              return Numeral.price(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.costPrice,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'profit',
        header: 'Lợi nhuận',
        columns: [
          columnHelper.accessor('profit', {
            id: 'profit',
            enableSorting: false,
            header: () => '[12=10-11]',
            cell: (context) => {
              const rowIndex = context.row.index;
              if (rowIndex === 0) {
                return (
                  <Typography variant="subtitle1" fontWeight={500}>
                    {Numeral.price(context.getValue())}
                  </Typography>
                );
              }
              return Numeral.price(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.profit,
            },
          }),
        ],
        meta: {},
      }),
      columnHelper.group({
        id: 'purchaseDate',
        header: 'Ngày mua cuối',
        columns: [
          columnHelper.accessor('purchaseDate', {
            id: 'purchaseDate',
            enableSorting: false,
            header: () => '[13]',
            cell: (context) =>
              DateTime.Format(context.getValue(), 'DD/MM/YYYY'),
            meta: {
              title: HEAD_CELLS.purchaseDate,
            },
          }),
        ],
        meta: {},
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
