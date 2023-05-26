import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useEffect, useState } from 'react';
import useTableColumns from './TableColumns';
import { AppDispatch } from 'store';
import { useDispatch } from 'react-redux';
import { getBillEntiresByBillCustomer } from 'slices/billCustomerApplicationSlice';

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
interface Props {
  idBill: string;
}

interface TableBillEntries {
  [key: string]: any;
}
const EntriesTable = (props: Props) => {
  const { idBill } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [, refetch] = useRefresh();
  const [listBillEntries, setListBillEntries] = useState<TableBillEntries[]>([])
  const [banners] = useState<any>(DATA);
  const [loading] = useState<boolean>(false);
  const [total,setTotal] = useState<number>(0);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });

  const fetchBillEntries = async () => {
    const body = {
      billCustomerId: idBill,
      pageIndex: filters.pageNumber,
      pageSize: filters.pageSize,
    };
    try {
      if (idBill) {
        const response: any = await dispatch(
          getBillEntiresByBillCustomer(body)
        );
        if (response.payload) {
          setListBillEntries(response.payload.data);
          setTotal(response.payload.objCount.total);
        }
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchBillEntries();
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
          data={listBillEntries}
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

export default EntriesTable;
