import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useState } from 'react';
import useTableColumns from './TableColumns';
import useDialog from 'hooks/useDialog';

const DATA = [
  {
    id: 1,
    image: 'image',
    product: 'Sản phẩm',
    unit: 'ĐVT',
    price: 25000,
    amount: 2,
    payment: 50000,
    discount: 10,
    total: 50000,
  },
  {
    id: 2,
    image: 'image',
    product: 'Sản phẩm',
    unit: 'ĐVT',
    price: 25000,
    amount: 2,
    payment: 50000,
    discount: 10,
    total: 50000,
  },
  {
    id: 1,
    image: 'image',
    product: 'Sản phẩm',
    unit: 'ĐVT',
    price: 25000,
    amount: 2,
    payment: 50000,
    discount: 10,
    total: 50000,
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
  const dialog = useDialog();

  const onPageChange = () => {};

  const onPageSizeChange = () => {};

  const handleDeleteSelected = () => {
    dialog({
      headline: 'Xác nhận xóa?',
      supportingText: <Fragment>Bạn có chắc chắn muốn xóa: </Fragment>,
      onConfirm: async () => {},
    });
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleDeleteSelected,
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
