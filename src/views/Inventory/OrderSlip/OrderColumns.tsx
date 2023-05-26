import CalculateIcon from '@mui/icons-material/Calculate';
import { IconButton, Stack, TextField } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  index: 'ID',
  imageUrl: 'Ảnh',
  code: 'Mã sản phẩm',
  name: 'Tên sản phẩm',
  markCode: 'Mã vạch',
  importPrice: 'Giá nhập',
  costPrice: 'Giá vốn',
  price: 'Giá bán',
  priceVAT: 'Giá bán + VAT',
  wholesalePrice: 'Giá sỉ',
  inventory: 'Tồn',
  totalInventory: 'Tổng tồn',
  actions: 'Hành động',
};

const useTableColumns = () => {
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('imageUrl', {
        id: 'imageUrl',
        size: 150,
        enableSorting: false,
        header: () => 'Sản phẩm',
        cell: (context) => 'CÁP LOA TRONG - Loa đơn 12	',
        meta: {
          title: HEAD_CELLS.imageUrl,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        header: () => 'SL yêu cầu',
        cell: (context) => '1900',
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 150,
        header: () => 'SL nhập',
        cell: (context) => {
          return (
            <Stack>
              <TextField value={0} />
              <IconButton>
                <CalculateIcon />
              </IconButton>
            </Stack>
          );
        },

        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 150,
        header: () => 'Giá cước',
        cell: (context) => {
          return <TextField value={0} />;
        },

        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 150,
        header: () => 'Ghi chú',
        cell: (context) => {
          return <TextField value="" />;
        },

        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        header: () => 'Đơn giá VNĐ',
        cell: (context) => '20,292',
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        header: () => 'Giá nhập VNĐ',
        cell: (context) => '20,292',
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        header: () => 'Tổng tiền',
        cell: (context) => '38,554,800',
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  return { columns };
};

export default useTableColumns;
