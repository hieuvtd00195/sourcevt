import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useState } from 'react';
import useTableColumns from './TableColumns';

const DATA = [
  {
    id: 1,
    product: 'Sản phẩm',
    amount: 'SL',
    price: 'Giá',
    discount: 'Chiết khấu',
    total: 'Tổng',
  },
  {
    id: 2,
    product: 'Sản phẩm',
    amount: 'SL',
    price: 'Giá',
    discount: 'Chiết khấu',
    total: 'Tổng',
  },
  {
    id: 3,
    product: 'Sản phẩm',
    amount: 'SL',
    price: 'Giá',
    discount: 'Chiết khấu',
    total: 'Tổng',
  },
];

const CustomerTable = () => {
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
      <Box sx={{ height: '300px' }}>
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

export default CustomerTable;
