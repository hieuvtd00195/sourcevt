import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { SumaryCashStore } from './utils/type';

const columnHelper = getColumnHelper<SumaryCashStore>();

const HEAD_CELLS: HeadCell<SumaryCashStore> = {
  index: 'ID',
  code: 'Thu',
  store: 'Ngày',
  name: 'Chi',
  startBalance: 'Báo cáo',
  totalPay: 'Báo nợ (Rút tiền)',
  lastBalance: 'Chuyển khoản',
  totalCol: 'Báo có (Nộp tiền)',
  total: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<SumaryCashStore> = useMemo(() => {
    return [
      columnHelper.accessor('store', {
        id: 'store',
        size: 100,
        header: () => HEAD_CELLS.store,
        cell: (context) => (
          <Typography color={'blue'}>{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.store,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        header: () => HEAD_CELLS.code,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{item}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        header: () => HEAD_CELLS.name,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{item}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('startBalance', {
        id: 'startBalance',
        size: 100,
        header: () => HEAD_CELLS.startBalance,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{Numeral.price(item)}</Typography>
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
        header: () => HEAD_CELLS.totalCol,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{Numeral.price(item)}</Typography>
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
        header: () => HEAD_CELLS.totalPay,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{Numeral.price(item)}</Typography>
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
        header: () => HEAD_CELLS.lastBalance,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{Numeral.price(item)}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.lastBalance,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 100,
        header: () => HEAD_CELLS.total,
        cell: (context) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.getValue().map((item: string) => (
              <Typography color={'blue'}>{Numeral.price(item)}</Typography>
            ))}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.total,
        },
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
