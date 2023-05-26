import { Box } from '@mui/material';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { useEffect, useRef } from 'react';
import { getPurchaseHistory } from 'slices/purchaseHistory';
import { useTypedDispatch, useTypedSelector } from 'store';
import { IPurchaseHistory } from 'types/purchaseHistory';
import { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import ActionButtonComponent from './components/ActionButton';
import CreateCustomerButton from './components/CreateCustomerButton';
import useFilters from './utils/filters';

const PurchaseHistoryTable = () => {
  const [, refetch] = useRefresh();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const { PurchaseHistory, loading, total, totalMoney } = useTypedSelector(
    (state) => state.purchaseHistory
  );

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    totalMoney,
  });

  useEffect(() => {
    dispatch(getPurchaseHistory(filters))
      .unwrap()
      .catch((error) => {
        setNotification({
          error: error?.message || 'Lỗi khi tải danh sách lịch sử mua hàng',
        });
      });
  }, [dispatch, filters, setNotification]);

  return (
    <ProTable<IPurchaseHistory>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={PurchaseHistory}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageIndex || 1,
        total,
        pageSize: filters.pageSize,
        onPageChange,
        onPageSizeChange,
      }}
      filter={
        <FiltersForm
          ref={filtersRef}
          onSearch={onSearch}
          onSubmit={handleSubmitFilters}
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <CreateCustomerButton />
          <ActionButtonComponent />
        </Box>
      }
    />
  );
};

export default PurchaseHistoryTable;
