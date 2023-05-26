import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Box } from '@mui/material';
import Index from 'components/ProTable/components/Index';
import type { BusinessResult, Value } from './utils/type';

const columnHelper = getColumnHelper<BusinessResult>();

const HEAD_CELLS: HeadCell<BusinessResult> = {
  index: 'STT',
  target: 'Chỉ tiêu',
  value: 'Giá trị',
  revenue: '% / doanh thu',
  description: 'Mô tả',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const columns: ProColumn<BusinessResult> = useMemo(() => {
    return [
      Index<BusinessResult>(pageNumber, pageSize),

      columnHelper.accessor('target', {
        id: 'target',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.target,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.target,
        },
      }),
      columnHelper.accessor('value', {
        id: 'value',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.value,
        cell: (context) => {
          const value = context.getValue<Value>();
          return (
            <Box color={value.type === 'positive' ? 'green' : 'red'}>
              {value.value ? Numeral.price(value.value) : ''}{' '}
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.value,
        },
      }),
      columnHelper.accessor('revenue', {
        id: 'revenue',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.revenue,
        cell: (context) => {
          const value = context.getValue<Value>();
          return (
            <Box color={value.type === 'positive' ? 'green' : 'red'}>
              {value.value ? `${value.value}%` : ''}{' '}
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.revenue,
        },
      }),
      columnHelper.accessor('description', {
        id: 'description',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.description,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.description,
        },
      }),
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
