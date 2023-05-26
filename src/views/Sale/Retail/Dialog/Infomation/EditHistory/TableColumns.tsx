import Typography from '@mui/material/Typography';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  author: 'Người sửa',
  date: 'Ngày sửa',
  detail: 'Chi tiết',
};

interface Props {
  pageNumber?: number;
  pageSize?: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('author', {
        id: 'author',
        size: 100,
        header: () => HEAD_CELLS.author,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.author,
        },
      }),
      columnHelper.accessor('date', {
        id: 'date',
        size: 100,
        header: () => HEAD_CELLS.date,
        cell: (context) => (
          <Typography
            variant="subtitle2"
            sx={{ color: '#007bff', cursor: 'pointer' }}
          >
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.date,
        },
      }),
      columnHelper.accessor('detail', {
        id: 'detail',
        size: 100,
        header: () => HEAD_CELLS.detail,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.detail,
        },
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
