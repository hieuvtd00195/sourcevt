import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import filter from 'lodash.filter';
import { useMemo } from 'react';
import type { FlattenedBill } from './utils/types';

const columnHelper = getColumnHelper<FlattenedBill>();

const HEAD_CELLS: HeadCell<FlattenedBill> = {
  index: 'ID',

  id: 'Mã sản phẩm',
  createdBy: 'Người tạo',
  store: 'Cửa hàng',
  customer: 'Khách hàng',
  product: 'Sản phẩm',
  price: 'Giá',

  actions: 'Hành động',
};

const useTableColumns = () => {
  const columns: ProColumn<FlattenedBill> = useMemo(() => {
    return [
      columnHelper.display({
        id: 'selection',
        size: 60,
        maxSize: 60,
        minSize: 60,
        header: (info) => (
          <Checkbox
            checked={info.table.getIsAllRowsSelected()}
            indeterminate={info.table.getIsSomeRowsSelected()}
            onChange={info.table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Box>
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </Box>
        ),
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
        meta: {
          title: 'Chọn tất cả',
          colSpan: () => 6,
        },
      }),

      columnHelper.accessor('id', {
        id: 'id',
        size: 300,
        enableSorting: false,
        header: () => HEAD_CELLS.id,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.id,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              { id: context.getValue() }
            );

            if (context.row.original.product === result[0]?.product) {
              return result.length;
            }

            return null;
          },
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('createdBy', {
        id: 'createdBy',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.createdBy,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.createdBy,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              { createdBy: context.getValue() }
            );

            if (context.row.original.product === result[0]?.product) {
              return result.length;
            }

            return null;
          },
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('store', {
        id: 'store',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.store,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.store,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              { store: context.getValue() }
            );

            if (context.row.original.product === result[0]?.product) {
              return result.length;
            }

            return null;
          },
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('customer', {
        id: 'customer',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.customer,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.customer,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              { customer: context.getValue() }
            );

            // Apply rowSpan at first row of each product group
            if (context.row.original.product === result[0]?.product) {
              return result.length;
            }

            return null;
          },
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 300,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.price,
        cell: (context) => context.getValue(),
        footer: (context) => {
          return Math.random();
        },
        meta: {
          title: HEAD_CELLS.price,
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
                  label: 'Thông tin khuyến mãi',
                  value: 1,
                  actionType: 'gift',
                },
                {
                  label: 'Chỉnh sửa sản phẩm',
                  value: 2,
                  actionType: 'edit',
                },
                {
                  label: 'Xóa',
                  value: 3,
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
