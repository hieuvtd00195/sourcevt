import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  math: 'Bút toán',
  date: 'Ngày',
  type: 'Loại',
  money: 'Số tiền',
  debt: 'Nợ',
  have: 'Có',
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
      columnHelper.accessor('math', {
        id: 'math',
        size: 30,
        header: () => HEAD_CELLS.math,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.math,
        },
      }),
      columnHelper.accessor('date', {
        id: 'date',
        size: 100,
        header: () => HEAD_CELLS.date,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.date,
        },
      }),
      columnHelper.accessor('type', {
        id: 'type',
        size: 100,
        header: () => HEAD_CELLS.type,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.type,
        },
      }),
      columnHelper.accessor('money', {
        id: 'money',
        size: 100,
        header: () => HEAD_CELLS.money,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.money,
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
      columnHelper.accessor('have', {
        id: 'have',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.have,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.have,
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
