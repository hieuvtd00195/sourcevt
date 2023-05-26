import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useState } from 'react';
import useTableColumns from './TableColumns';

const DATA = [
  {
    math: 'Bút toán',
    date: 'Ngày',
    type: 'Loại',
    money: 'Số tiền',
    debt: 'Nợ',
    have: 'Có',
    note: 'Diễn giải',
  },
  {
    math: 'Bút toán',
    date: 'Ngày',
    type: 'Loại',
    money: 'Số tiền',
    debt: 'Nợ',
    have: 'Có',
    note: 'Diễn giải',
  },
  {
    math: 'Bút toán',
    date: 'Ngày',
    type: 'Loại',
    money: 'Số tiền',
    debt: 'Nợ',
    have: 'Có',
    note: 'Diễn giải',
  },
];

const ProductTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<any>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });

  const onPageChange = () => {};

  const onPageSizeChange = () => {};

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <>
      <Box sx={{ height: '500px' }}>
        <ProTable<any>
          title="Danh sách"
          loading={loading}
          columns={columns}
          data={banners}
          refetch={refetch}
          pagination={{
            page: filters.pageNumber,
            total,
            pageSize: filters.pageSize,
            onPageChange,
            onPageSizeChange,
          }}
        />
      </Box>
    </>
  );
};

export default ProductTable;
