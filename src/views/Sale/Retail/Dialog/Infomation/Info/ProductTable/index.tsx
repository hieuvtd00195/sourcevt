import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useEffect, useState } from 'react';
import useTableColumns from './TableColumns';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import useNotification from 'hooks/useNotification';
import { getBillProductByBillCustomer } from 'slices/billCustomerApplicationSlice';

interface Props {
  idBill: string;
}


interface TableBillProduct {
  [key: string]: any;
}
const ProductTable = (props: Props) => {
  const { idBill } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [refresh, refetch] = useRefresh();
  const setNotification = useNotification();

  const [loading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [listBillProduct, setListBillProduct] = useState<TableBillProduct[]>([])
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });

  const fetchBillProduct = async () => {
    const body = {
      billCustomerId: idBill,
      pageIndex: filters.pageNumber,
      pageSize: filters.pageSize,
    };
    try {
      if (idBill) {
        const response: any = await dispatch(
          getBillProductByBillCustomer(body)
        );
        if (response.payload) {
          setListBillProduct(response.payload.data)
          setTotal(response.payload.objCount.total);
        }
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchBillProduct();
  }, [idBill]);

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
          data={listBillProduct}
          refetch={refetch}
          initialstate={{
            hiddenColumns: [],
            hiddenVisibilityColumns: true,
          }}
          hideFooter
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
