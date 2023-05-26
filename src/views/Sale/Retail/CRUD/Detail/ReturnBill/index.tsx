import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useState } from 'react';
// import { Product } from 'types/products';
import Box from '@mui/material/Box';
import useTableColumns from './TableColumns';

const DATA = [
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
  {
    date: '21/11/2022',
    id: '123',
    type: 'Loại',
    customer: 'Khách hàng',
    product: 'Sản phẩm',
    price: 'Giá',
    amount: 'SL',
    discount: 'Chiết khấu',
    focus: 'Tiêu điểm',
    totalPrice: 'Tổng tiền',
    note: 'Ghi chú',
  },
];

const ReturnBill = () => {
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

export default ReturnBill;
