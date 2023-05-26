import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Box, IconButton } from '@mui/material';
import { Branch } from './utils/type';
import EditIcon from '@mui/icons-material/Edit';

const columnHelper = getColumnHelper<Branch>();

const HEAD_CELLS: HeadCell<Branch> = {
  index: 'ID',
  product: 'Sản phẩm',
  retail: 'Giá lẻ',
  whole: 'Giá sỉ',
  spa: 'Giá spa',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditNote: (id: string, note: string) => void;
}

const useTableColumns = (props: Props) => {
  const { handleEditNote } = props;

  const columns: ProColumn<Branch> = useMemo(() => {
    return [
      columnHelper.accessor('product', {
        id: 'product',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
        },
      }),
      columnHelper.group({
        id: 'productPrice',
        header: 'Giá sản phẩm',
        columns: [
          columnHelper.accessor('productPrice', {
            id: 'productPrice',
            enableSorting: false,
            size: 50,
            header: () => HEAD_CELLS.retail,
            cell: (context) => {
              const { productPrice, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {productPrice?.retail && Numeral.price(productPrice?.retail)}
                  <IconButton
                    onClick={() =>
                      handleEditNote(id, productPrice?.retail || '')
                    }
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.productPrice,
            },
          }),
          columnHelper.accessor('productPrice', {
            id: 'productPrice',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.whole,
            cell: (context) => {
              const { productPrice, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {productPrice?.whole && Numeral.price(productPrice?.whole)}
                  <IconButton
                    onClick={() =>
                      handleEditNote(id, productPrice?.whole || '')
                    }
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.productPrice,
            },
          }),
          columnHelper.accessor('productPrice', {
            id: 'productPrice',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.spa,
            cell: (context) => {
              const { productPrice, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {productPrice?.spa && Numeral.price(productPrice?.spa)}
                  <IconButton
                    onClick={() => handleEditNote(id, productPrice?.spa || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.productPrice,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'vinh',
        header: 'Kho Vinh',
        columns: [
          columnHelper.accessor('vinh', {
            id: 'vinh',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.retail,
            cell: (context) => {
              const { vinh, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {vinh?.retail && Numeral.price(vinh?.retail)}
                  <IconButton
                    onClick={() => handleEditNote(id, vinh?.retail || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.vinh,
            },
          }),
          columnHelper.accessor('vinh', {
            id: 'vinh',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.whole,
            cell: (context) => {
              const { vinh, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {vinh?.whole && Numeral.price(vinh?.whole)}
                  <IconButton
                    onClick={() => handleEditNote(id, vinh?.whole || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.vinh,
            },
          }),
          columnHelper.accessor('vinh', {
            id: 'vinh',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.spa,
            cell: (context) => {
              const { vinh, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {vinh?.spa && Numeral.price(vinh?.spa)}
                  <IconButton
                    onClick={() => handleEditNote(id, vinh?.spa || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.vinh,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'phatdat',
        header: 'Phát Đạt',
        columns: [
          columnHelper.accessor('phatdat', {
            id: 'phatdat',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.retail,
            cell: (context) => {
              const { phatdat, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {phatdat?.retail && Numeral.price(phatdat?.retail)}
                  <IconButton
                    onClick={() => handleEditNote(id, phatdat?.retail || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.phatdat,
            },
          }),
          columnHelper.accessor('phatdat', {
            id: 'phatdat',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.whole,
            cell: (context) => {
              const { phatdat, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {phatdat?.whole && Numeral.price(phatdat?.whole)}
                  <IconButton
                    onClick={() => handleEditNote(id, phatdat?.whole || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.phatdat,
            },
          }),
          columnHelper.accessor('phatdat', {
            id: 'phatdat',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.spa,
            cell: (context) => {
              const { phatdat, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {phatdat?.spa && Numeral.price(phatdat?.spa)}
                  <IconButton
                    onClick={() => handleEditNote(id, phatdat?.spa || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.phatdat,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'hcm',
        header: 'Hồ Chí Minh',
        columns: [
          columnHelper.accessor('hcm', {
            id: 'hcm',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.retail,
            cell: (context) => {
              const { hcm, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {hcm?.retail && Numeral.price(hcm?.retail)}
                  <IconButton
                    onClick={() => handleEditNote(id, hcm?.retail || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.hcm,
            },
          }),
          columnHelper.accessor('hcm', {
            id: 'hcm',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.whole,
            cell: (context) => {
              const { hcm, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {hcm?.whole && Numeral.price(hcm?.whole)}
                  <IconButton
                    onClick={() => handleEditNote(id, hcm?.whole || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.hcm,
            },
          }),
          columnHelper.accessor('hcm', {
            id: 'hcm',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.spa,
            cell: (context) => {
              const { hcm, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {hcm?.spa && Numeral.price(hcm?.spa)}
                  <IconButton
                    onClick={() => handleEditNote(id, hcm?.spa || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.hcm,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'dn',
        header: 'Đà Nẵng',
        columns: [
          columnHelper.accessor('dn', {
            id: 'dn',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.retail,
            cell: (context) => {
              const { dn, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {dn?.retail && Numeral.price(dn?.retail)}
                  <IconButton
                    onClick={() => handleEditNote(id, dn?.retail || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.dn,
            },
          }),
          columnHelper.accessor('dn', {
            id: 'dn',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.whole,
            cell: (context) => {
              const { dn, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {dn?.whole && Numeral.price(dn?.whole)}
                  <IconButton
                    onClick={() => handleEditNote(id, dn?.whole || '')}
                  >
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.dn,
            },
          }),
          columnHelper.accessor('dn', {
            id: 'dn',
            size: 50,
            enableSorting: false,
            header: () => HEAD_CELLS.spa,
            cell: (context) => {
              const { dn, id } = context.row.original;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {dn?.spa && Numeral.price(dn?.spa)}
                  <IconButton onClick={() => handleEditNote(id, dn?.spa || '')}>
                    <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
                  </IconButton>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.dn,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
    ];
  }, [handleEditNote]);

  return { columns };
};

export default useTableColumns;
