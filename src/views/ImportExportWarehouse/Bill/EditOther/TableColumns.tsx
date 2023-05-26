import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IImportExport } from './utils/types';

const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  index: 'ID',
  inventory: 'Tồn',
  unit: 'ĐVT',
  productCode: 'Mã sản phẩm',
  product: 'Sản Phẩm',
  quantity: 'SL',
  failQuantity: 'SL lỗi',
  IMEI: 'IMEI',
  price: 'Giá',
  thanhTien: 'Tiền',
  chietKhau: 'Chiết khấu',
  khoiLuong: 'Khối lượng',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<IImportExport> = useMemo(() => {
    return [
      columnHelper.accessor('productCode', {
        id: 'productCode',
        size: 50,
        header: () => HEAD_CELLS.productCode,
        enableSorting: false,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productCode,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => (
          <Stack direction={'column'} spacing={2}>
            <Typography variant="body2">{context.getValue().code}</Typography>
            <TextField size="small" placeholder="Mô tả sản phẩm" />
          </Stack>
        ),
        meta: {
          title: HEAD_CELLS.product,
        },
      }),
      columnHelper.accessor('unit', {
        id: 'unit',
        size: 50,
        header: () => HEAD_CELLS.unit,
        enableSorting: false,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.unit,
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 200,
        header: () => HEAD_CELLS.quantity,
        enableSorting: false,
        cell: (context) => (
          <Box>
            <TextField size="small" />
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.quantity,
        },
      }),
      columnHelper.accessor('IMEI', {
        id: 'IMEI',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.IMEI,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.IMEI,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 200,
        header: () => HEAD_CELLS.price,
        enableSorting: false,
        cell: (context) => (
          <Box>
            <TextField size="small" />
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.price,
        },
      }),
      columnHelper.accessor('thanhTien', {
        id: 'thanhTien',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.thanhTien,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.thanhTien,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Xóa sản phẩm',
                  value: 1,
                  actionType: 'delete',
                },
              ]}
            >
              <ActionIconButton actionType="action" />
            </ProMenu>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
