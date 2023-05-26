import Index from 'components/ProTable/components/Index';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Link, Typography } from '@mui/material';
import { Account, Balance } from './utils/type';

const columnHelper = getColumnHelper<Account>();

const HEAD_CELLS: HeadCell<Account> = {
  index: 'ID',
  code: 'Mã',
  name: 'Tên',
  startBalance: 'Số dư đầu kì',
  ariseBalance: 'Phát sinh trong kì',
  endBalance: 'Số dư cuối kì',
  debit: 'Ghi nợ',
  credit: 'Ghi có',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const columns: ProColumn<Account> = useMemo(() => {
    return [
      Index<Account>(pageNumber, pageSize),

      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => (
          <Link href="#" color="#2196F3">
            {context.getValue()}
          </Link>
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
        cell: (context) => {
          const value = context.getValue();
          const rowIndex = context.row.index;
          return rowIndex === 0 ? (
            <Typography variant="subtitle2" fontWeight={600}>
              {value}
            </Typography>
          ) : (
            <Link href="#" color="#2196F3">
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.group({
        id: 'startBalance',
        header: 'Số dư đầu kì',
        columns: [
          columnHelper.accessor('startBalance', {
            id: 'startBalance',
            size: 100,
            enableSorting: false,
            header: () => HEAD_CELLS.debit,
            cell: (context) => {
              const value = context.getValue<Balance>();
              const rowIndex = context.row.index;
              if (!value) return;
              return rowIndex === 0 ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {Numeral.price(value.debit)}
                </Typography>
              ) : (
                Numeral.price(value.debit)
              );
            },
            meta: {
              title: HEAD_CELLS.startBalance,
            },
          }),
          columnHelper.accessor('startBalance1', {
            id: 'startBalance1',
            size: 100,
            enableSorting: false,
            header: () => HEAD_CELLS.credit,
            cell: (context) => {
              const { startBalance } = context.row.original;
              const rowIndex = context.row.index;
              if (!startBalance) return;
              return rowIndex === 0 ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {Numeral.price(startBalance.credit)}
                </Typography>
              ) : (
                Numeral.price(startBalance.credit)
              );
            },
            meta: {
              title: HEAD_CELLS.startBalance1,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'ariseBalance',
        header: HEAD_CELLS.ariseBalance,
        columns: [
          columnHelper.accessor('ariseBalance', {
            id: 'ariseBalance',
            size: 100,
            enableSorting: false,
            header: () => HEAD_CELLS.debit,
            cell: (context) => {
              const value = context.getValue<Balance>();
              const rowIndex = context.row.index;
              if (!value) return;
              return rowIndex === 0 ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {Numeral.price(value.debit)}
                </Typography>
              ) : (
                Numeral.price(value.debit)
              );
            },
            meta: {
              title: HEAD_CELLS.ariseBalance,
            },
          }),
          columnHelper.accessor('ariseBalance1', {
            id: 'ariseBalance1',
            size: 100,
            enableSorting: false,
            header: () => HEAD_CELLS.credit,
            cell: (context) => {
              const { ariseBalance } = context.row.original;
              const rowIndex = context.row.index;
              if (!ariseBalance) return;
              return rowIndex === 0 ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {Numeral.price(ariseBalance.credit)}
                </Typography>
              ) : (
                Numeral.price(ariseBalance.credit)
              );
            },
            meta: {
              title: HEAD_CELLS.ariseBalance1,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'endBalance',
        header: HEAD_CELLS.endBalance,
        columns: [
          columnHelper.accessor('endBalance', {
            id: 'endBalance',
            size: 100,
            enableSorting: false,
            header: () => HEAD_CELLS.debit,
            cell: (context) => {
              const value = context.getValue<Balance>();
              const rowIndex = context.row.index;
              if (!value) return;
              return rowIndex === 0 ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {Numeral.price(value.debit)}
                </Typography>
              ) : (
                Numeral.price(value.debit)
              );
            },
            meta: {
              title: HEAD_CELLS.endBalance,
            },
          }),
          columnHelper.accessor('endBalance1', {
            id: 'endBalance1',
            size: 100,
            enableSorting: false,
            header: () => HEAD_CELLS.credit,
            cell: (context) => {
              const { ariseBalance } = context.row.original;
              const rowIndex = context.row.index;
              if (!ariseBalance) return;
              return rowIndex === 0 ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {Numeral.price(ariseBalance.credit)}
                </Typography>
              ) : (
                Numeral.price(ariseBalance.credit)
              );
            },
            meta: {
              title: HEAD_CELLS.endBalance1,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
