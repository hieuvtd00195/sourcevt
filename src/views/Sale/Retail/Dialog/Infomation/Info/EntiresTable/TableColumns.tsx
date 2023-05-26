import { Stack, Typography } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  entryCode: 'Bút toán',
  transactionDate: 'Ngày',
  ticketTypeName: 'Loại',
  amount: 'Số tiền',
  debt: 'Nợ',
  credit: 'Có',
  note: 'Diễn giải',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<any> = useMemo(() => {
    return [
      // Index<any>(pageNumber, pageSize),
      columnHelper.accessor('entryCode', {
        id: 'entryCode',
        size: 30,
        header: () => HEAD_CELLS.entryCode,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.entryCode,
        },
      }),
      columnHelper.accessor('transactionDate', {
        id: 'transactionDate',
        size: 100,
        header: () => HEAD_CELLS.transactionDate,
        cell: (context) => {
          const value = context.getValue();
          if (!value) return;
          return (
            <Stack direction="column">
              <Typography>{DateTime.Format(value, 'DD-MM-YYYY')} </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.transactionDate,
        },
      }),
      columnHelper.accessor('ticketTypeName', {
        id: 'ticketTypeName',
        size: 100,
        header: () => HEAD_CELLS.ticketTypeName,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.ticketTypeName,
        },
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        size: 100,
        header: () => HEAD_CELLS.amount,
        cell: (context) => {
          return (
            <Typography>{Numeral.price(context.getValue())}</Typography>
          )
        },
        meta: {
          title: HEAD_CELLS.amount,
        },
      }),
      columnHelper.accessor('debt', {
        id: 'debt',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.debt,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.debt,
        },
      }),
      columnHelper.accessor('credit', {
        id: 'credit',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.credit,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.credit,
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.note,
        },
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
