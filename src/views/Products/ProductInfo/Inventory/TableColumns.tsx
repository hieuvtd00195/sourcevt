import WarehouseIcon from '@mui/icons-material/Warehouse';
import { Box, Link } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Inventorys } from '.';

const columnHelper = getColumnHelper<Inventorys>();

const HEAD_CELLS: HeadCell<Inventorys> = {
  index: 'ID',
  storage: 'Cửa hàng',
  inventory: 'Tồn',
  defective: 'Lỗi',
  shipping: 'Đang giao hàng',
  inventoryStorage: 'Tồn trong kho',
  changeStore: 'Đã xuất chuyển kho',
  pending: 'Chờ nhập chuyển kho',
  custody: 'Tạm giữ',
  custodyComponents: 'Tạm giữ linh kiện',
  warranty: 'Bảo hành',
  sellable: 'Có thể bán',
  pendingImport: 'Đang về',
  reserve: 'Đặt trước',
};

interface Props {}

const useTableColumns = (props: Props) => {
  const dialog = useDialog();

  const columns: ProColumn<Inventorys> = useMemo(() => {
    return [
      // columnHelper.accessor('storage', {
      //   id: 'storage',
      //   size: 120,
      //   enableSorting: false,
      //   header: () => HEAD_CELLS.storage,
      //   cell: (context) => (
      //     <Box>
      //       <span>
      //         <WarehouseIcon />
      //       </span>
      //       {context.getValue()}
      //     </Box>
      //   ),
      //   meta: {
      //     title: HEAD_CELLS.storage,
      //   },
      // }),
      columnHelper.accessor('inventory', {
        enableSorting: false,
        id: 'inventory',
        size: 40,
        header: () => HEAD_CELLS.inventory,
        cell: (context) => (
          <Link href="/inventory?value=filter1" color="#077BFF">
            {Numeral.price(context.getValue())}
          </Link>
        ),
        meta: {
          title: HEAD_CELLS.inventory,
        },
      }),
      columnHelper.accessor('shipping', {
        enableSorting: false,
        size: 40,
        id: 'shipping',
        header: () => HEAD_CELLS.shipping,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.shipping,
        },
      }),
      columnHelper.accessor('changeStore', {
        enableSorting: false,
        size: 40,
        id: 'changeStore',
        header: () => HEAD_CELLS.changeStore,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.changeStore,
        },
      }),
      columnHelper.accessor('pending', {
        size: 40,
        enableSorting: false,
        id: 'pending',
        header: () => HEAD_CELLS.pending,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.pending,
        },
      }),
      // columnHelper.accessor('custody', {
      //   size: 40,
      //   enableSorting: false,
      //   id: 'custody',
      //   header: () => HEAD_CELLS.custody,
      //   cell: (context) => Numeral.price(context.getValue()),
      //   meta: {
      //     title: HEAD_CELLS.custody,
      //   },
      // }),
      columnHelper.accessor('sellable', {
        size: 40,
        enableSorting: false,
        id: 'sellable',
        header: () => HEAD_CELLS.sellable,
        // Tồn - Tạm giữ
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.sellable,
        },
      }),
      columnHelper.accessor('pendingImport', {
        size: 40,
        enableSorting: false,
        id: 'pendingImport',
        header: () => HEAD_CELLS.pendingImport,
        // SL yêu cầu - SL đã nhập
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.pendingImport,
        },
      }),
      columnHelper.accessor('reserve', {
        enableSorting: false,
        size: 40,
        id: 'reserve',
        header: () => 'Tạm giữ',
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.reserve,
        },
      }),
      columnHelper.accessor('reserve', {
        enableSorting: false,
        size: 40,
        id: 'reserve',
        header: () => HEAD_CELLS.reserve,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.reserve,
        },
      }),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  return { columns };
};

export default useTableColumns;
