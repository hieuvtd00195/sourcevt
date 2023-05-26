import { Typography } from '@mui/material';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import React, { useMemo } from 'react';
import { IInventoryByProductsType } from './utils/type';

interface Props {
  pageNumber: number;
  pageSize: number;
}

const columnHelper = getColumnHelper<IInventoryByProductsType>();

const HEAD_CELLS: HeadCell<IInventoryByProductsType> = {
  code: 'Mã',
  barcode: 'Mã vạch',
  product: 'Sản phẩm',
  currentInventory: 'Tồn hiện tại',
  totalInventory: 'Tổng tồn',
  quantityBeginningInventory: 'SL',
  costBeginningInventory: 'Giá vốn',
  priceBeginningInventory: 'Thành tiền',
  quantityImport: 'SL',
  costImport: 'Giá vốn',
  priceImport: 'Thành tiền',
  quantityExport: 'SL',
  costExport: 'Giá vốn',
  priceExport: 'Thành tiền',
  quantityEndingInventory: 'SL',
  costEndingInventory: 'Giá vốn',
  priceEndingInventory: 'Thành tiền',
};

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const columns: ProColumn<IInventoryByProductsType> = useMemo(() => {
    return [
      columnHelper.accessor('code', {
        id: 'code',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
        meta: {
          title: HEAD_CELLS.code,
          colSpan: () => 5,
        },
      }),
      columnHelper.accessor('barcode', {
        id: 'barcode',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.barcode,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.barcode,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.product,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('currentInventory', {
        id: 'currentInventory',
        size: 60,
        enableSorting: false,
        header: () => HEAD_CELLS.currentInventory,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.currentInventory,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('totalInventory', {
        id: 'totalInventory',
        size: 60,
        enableSorting: false,
        header: () => HEAD_CELLS.totalInventory,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalInventory,
          colSpan: () => null,
        },
      }),
      columnHelper.group({
        id: 'beginningInventory',
        header: 'Tồn đầu kỳ',
        columns: [
          columnHelper.accessor('quantityBeginningInventory', {
            id: 'quantityBeginningInventory',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.quantityBeginningInventory,
            cell: (context) => context.getValue(),
            footer: (context) => (
              <Typography variant="subtitle2">1831</Typography>
            ),
            meta: {
              title: HEAD_CELLS.quantityBeginningInventory,
              // colSpan: () => null,
            },
          }),
          columnHelper.accessor('costBeginningInventory', {
            id: 'costBeginningInventory',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.costBeginningInventory,
            footer: (context) => (
              <Typography variant="subtitle2">
                {1493?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.costBeginningInventory,
              // colSpan: () => null,
            },
          }),
          columnHelper.accessor('priceBeginningInventory', {
            id: 'priceBeginningInventory',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.priceBeginningInventory,
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            footer: (context) => (
              <Typography variant="subtitle2">
                {3502578?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.priceBeginningInventory,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'import',
        header: 'Nhập trong kỳ',
        columns: [
          columnHelper.accessor('quantityImport', {
            id: 'quantityImport',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.quantityImport,
            cell: (context) => context.getValue(),
            footer: (context) => (
              <Typography variant="subtitle2">9010</Typography>
            ),
            meta: {
              title: HEAD_CELLS.quantityImport,
              // colSpan: () => null,
            },
          }),
          columnHelper.accessor('costImport', {
            id: 'costImport',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.costImport,
            footer: (context) => (
              <Typography variant="subtitle2">
                {1428?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.costImport,
            },
          }),
          columnHelper.accessor('priceImport', {
            id: 'priceImport',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.priceImport,
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            footer: (context) => (
              <Typography variant="subtitle2">
                {12866280?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.priceImport,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),

      columnHelper.group({
        id: 'export',
        header: 'Xuất trong kỳ',
        columns: [
          columnHelper.accessor('quantityExport', {
            id: 'quantityExport',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.quantityExport,
            cell: (context) => context.getValue(),
            footer: (context) => (
              <Typography variant="subtitle2">9525</Typography>
            ),
            meta: {
              title: HEAD_CELLS.quantityExport,
            },
          }),
          columnHelper.accessor('costExport', {
            id: 'costExport',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.costExport,
            footer: (context) => (
              <Typography variant="subtitle2">
                {1428?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.costExport,
            },
          }),
          columnHelper.accessor('priceExport', {
            id: 'priceExport',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.priceExport,
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            footer: (context) => (
              <Typography variant="subtitle2">
                {13601700?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.priceExport,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'endingInventory',
        header: 'Tồn cuối kỳ',
        columns: [
          columnHelper.accessor('quantityEndingInventory', {
            id: 'quantityEndingInventory',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.quantityEndingInventory,
            cell: (context) => context.getValue(),
            footer: (context) => (
              <Typography variant="subtitle2">1831</Typography>
            ),
            meta: {
              title: HEAD_CELLS.quantityEndingInventory,
            },
          }),
          columnHelper.accessor('costEndingInventory', {
            id: 'costEndingInventory',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.costEndingInventory,
            footer: (context) => (
              <Typography variant="subtitle2">
                {1428?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.costEndingInventory,
            },
          }),
          columnHelper.accessor('priceEndingInventory', {
            id: 'priceEndingInventory',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.priceEndingInventory,
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            footer: (context) => (
              <Typography variant="subtitle2">
                {2614668?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.priceEndingInventory,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
    ];
  }, [pageNumber, pageSize]);
  return { columns };
};

export default useTableColumns;
