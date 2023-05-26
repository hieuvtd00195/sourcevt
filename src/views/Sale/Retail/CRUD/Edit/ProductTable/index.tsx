import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useState } from 'react';
import ActionProductDialog from './Dialog/ActionProductDialog';
import useTableColumns from './TableColumns';
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
  const [openDialogActionProduct, setOpenDialogActionProduct] =
    useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any>({});
  const onPageChange = () => {};

  const onPageSizeChange = () => {};

  const handleOpenDialog = (value: any) => {
    setDataSelected(value);
    setOpenDialogActionProduct(!openDialogActionProduct);
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleOpenDialog,
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
      <ActionProductDialog
        open={openDialogActionProduct}
        onClose={() => {
          setOpenDialogActionProduct(!openDialogActionProduct);
          setDataSelected({});
        }}
        value={dataSelected}
      />
    </>
  );
};

export default ProductTable;
