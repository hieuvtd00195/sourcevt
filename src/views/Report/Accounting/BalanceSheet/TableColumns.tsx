import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import type { BalanceSheet, Value } from './utils/type';

const columnHelper = getColumnHelper<BalanceSheet>();

const HEAD_CELLS: HeadCell<BalanceSheet> = {
  index: 'STT',
  assets: 'Tài sản',
  code: 'Mã số',
  thisPeriod: 'Số kỳ này',
  lastPeriod: 'Số kỳ trước',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<BalanceSheet> = useMemo(() => {
    return [
      columnHelper.accessor('assets', {
        id: 'assets',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.assets,
        cell: (context) => {
          const rowIndex = context.row.index;
          if ([0, 25, 59, 89, 105, 106].includes(rowIndex)) {
            return (
              <Typography variant="subtitle1" fontWeight="600">
                {context.getValue()}
              </Typography>
            );
          }
          return context.getValue();
        },
        meta: {
          title: HEAD_CELLS.assets,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => {
          const rowIndex = context.row.index;
          if (rowIndex === 0) {
            return;
          }
          return context.getValue();
        },
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('thisPeriod', {
        id: 'thisPeriod',
        enableSorting: false,
        header: () => HEAD_CELLS.thisPeriod,
        cell: (context) => {
          const rowIndex = context.row.index;
          const rowValue = context.getValue<Value | null>();
          if (rowIndex === 0 && !rowValue) {
            return;
          }
          if (rowValue?.type === 'negative') {
            return <Box color="red">{rowValue?.value}</Box>;
          } else {
            return <Box color="#4CAF50">{rowValue?.value}</Box>;
          }
        },
        meta: {
          title: HEAD_CELLS.thisPeriod,
        },
      }),
      columnHelper.accessor('lastPeriod', {
        id: 'lastPeriod',
        enableSorting: false,
        header: () => HEAD_CELLS.lastPeriod,
        cell: (context) => {
          const rowIndex = context.row.index;
          const rowValue = context.getValue<Value | null>();
          if (rowIndex === 0 && !rowValue) {
            return;
          }
          if (rowValue?.type === 'negative') {
            return <Box color="red">{rowValue?.value}</Box>;
          } else {
            return <Box color="#4CAF50">{rowValue?.value}</Box>;
          }
        },
        meta: {
          title: HEAD_CELLS.lastPeriod,
        },
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
