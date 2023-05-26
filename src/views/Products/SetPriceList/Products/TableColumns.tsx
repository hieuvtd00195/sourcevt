import { HeadCell, ProColumn } from 'components/ProTable/types';
import React, { useMemo } from 'react';
import { ISettingPriceProduct } from './utils/type';
import Selection from 'components/ProTable/components/Selection';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { IconButton, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useDialog from 'hooks/useDialog';
interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditPrice: (id: number) => void;
}

const columnHelper = getColumnHelper<ISettingPriceProduct>();

const HEAD_CELLS: HeadCell<ISettingPriceProduct> = {
  code: 'Mã sản phẩm',
  productsName: 'Tên sản phẩm',
  invetoryQuantity: 'SL tồn',
  importPrice: 'Giá nhập',
  retailPrice: 'Giá bán lẻ',
  cell500: 'Cell 500/đơn',
  cell300: 'Cell 300/đơn',
  cell100: 'Cell 100/đơn',
  spaPrice: 'Giá Spa',
  price: 'Giá Vốn',
};

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, handleEditPrice } = props;
  const dialog = useDialog();

  const columns: ProColumn<ISettingPriceProduct> = useMemo(() => {
    return [
      Selection<ISettingPriceProduct>(),
      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        header: () => HEAD_CELLS.code,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('productsName', {
        id: 'productsName',
        size: 100,
        header: () => HEAD_CELLS.productsName,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.productsName,
        },
      }),
      columnHelper.accessor('invetoryQuantity', {
        id: 'invetoryQuantity',
        size: 60,
        header: () => HEAD_CELLS.invetoryQuantity,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.invetoryQuantity,
        },
      }),
      columnHelper.accessor('importPrice', {
        id: 'importPrice',
        size: 60,
        header: () => HEAD_CELLS.importPrice,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.importPrice,
        },
      }),
      columnHelper.accessor('retailPrice', {
        id: 'retailPrice',
        size: 60,
        header: () => HEAD_CELLS.retailPrice,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.retailPrice,
        },
      }),
      columnHelper.accessor('cell500', {
        id: 'cell500',
        size: 60,
        header: () => HEAD_CELLS.cell500,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Stack alignItems="center">
              <IconButton onClick={() => handleEditPrice(id)}>
                <EditIcon color="inherit" />
              </IconButton>
              <Typography color="default">
                {context.getValue()?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.cell500,
        },
      }),
      columnHelper.accessor('cell300', {
        id: 'cell300',
        size: 60,
        header: () => HEAD_CELLS.cell300,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Stack alignItems="center">
              <IconButton onClick={() => handleEditPrice(id)}>
                <EditIcon color="inherit" />
              </IconButton>
              <Typography color="default">
                {context.getValue()?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.cell300,
        },
      }),
      columnHelper.accessor('cell100', {
        id: 'cell100',
        size: 60,
        header: () => HEAD_CELLS.cell100,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Stack alignItems="center">
              <IconButton onClick={() => handleEditPrice(id)}>
                <EditIcon color="inherit" />
              </IconButton>
              <Typography color="default">
                {context.getValue()?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Stack>
          );
        },

        meta: {
          title: HEAD_CELLS.cell100,
        },
      }),
      columnHelper.accessor('spaPrice', {
        id: 'spaPrice',
        size: 60,
        header: () => HEAD_CELLS.spaPrice,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Stack alignItems="center">
              <IconButton onClick={() => handleEditPrice(id)}>
                <EditIcon color="inherit" />
              </IconButton>
              <Typography color="default">
                {context.getValue()?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.spaPrice,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 60,
        header: () => HEAD_CELLS.price,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Stack alignItems="center">
              <IconButton onClick={() => handleEditPrice(id)}>
                <EditIcon color="inherit" />
              </IconButton>
              <Typography color="default">
                {context.getValue()?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.price,
        },
      }),
    ];
  }, [pageNumber, pageSize, dialog]);
  return { columns };
};

export default useTableColumns;
