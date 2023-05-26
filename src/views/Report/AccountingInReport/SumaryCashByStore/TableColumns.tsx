import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Index from 'components/ProTable/components/Index';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { SumaryCashStore } from './utils/type';

const columnHelper = getColumnHelper<SumaryCashStore>();

const HEAD_CELLS: HeadCell<SumaryCashStore> = {
  index: 'ID',
  code: 'Mã tài khoản',
  store: 'Cửa hàng',
  name: 'Tên tài khoản',
  startBalance: 'Số dư đầu kì',
  totalPay: 'Tổng chi',
  lastBalance: 'Số dư cuối kì',
  totalCol: 'Tổng thu',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const columns: ProColumn<SumaryCashStore> = useMemo(() => {
    return [
      Index<SumaryCashStore>(pageNumber, pageSize),

      columnHelper.accessor('store', {
        id: 'store',
        size: 200,
        header: () => HEAD_CELLS.store,
        cell: (context) => context.getValue(),
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.store,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        header: () => HEAD_CELLS.code,
        enableSorting: false,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string, index: number) => (
              <Typography key={index}>{item}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.name,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string, index: number) => (
              <Typography key={index}>{item}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('startBalance', {
        id: 'startBalance',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.startBalance,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string, index: number) => (
              <Typography key={index}>{Numeral.price(item)}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.startBalance,
        },
      }),
      columnHelper.accessor('totalCol', {
        id: 'totalCol',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalCol,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string, index: number) => (
              <Typography color={'blue'} key={index}>
                {Numeral.price(item)}
              </Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.totalCol,
        },
      }),
      columnHelper.accessor('totalPay', {
        id: 'totalPay',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalPay,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string, index: number) => (
              <Typography color={'blue'} key={index}>
                {Numeral.price(item)}
              </Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.totalPay,
        },
      }),
      columnHelper.accessor('lastBalance', {
        id: 'lastBalance',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.lastBalance,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string, index: number) => (
              <Typography key={index}>{Numeral.price(item)}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.lastBalance,
        },
      }),
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
