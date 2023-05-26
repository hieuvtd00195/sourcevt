import { Box } from '@mui/material';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { useEffect, useRef } from 'react';
import { getCustomerListApi } from 'slices/customer';
import { useTypedDispatch, useTypedSelector } from 'store';
import { ICustomer } from 'types/customer';
import { FiltersRef } from 'types/refs';
import FiltersForm from './FilterForm';
import useTableColumns from './TableColumns';
import ActionButtonComponent from './components/ActionButton';
import CreateCustomerButton from './components/CreateCustomerButton';
import useFilters from './utils/filters';

const CustomerTable = () => {
  const [, refetch] = useRefresh();
  const setNotification = useNotification();
  const { loading, customers, total } = useTypedSelector(
    (state) => state.customer
  );
  const dispatch = useTypedDispatch();
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  useEffect(() => {
    if (
      filters?.purchaseCycleFrom &&
      filters?.purchaseCycleTo &&
      (filters?.purchaseCycleFrom || 0) > (filters?.purchaseCycleTo || 0)
    ) {
      return;
    }
    if (
      filters?.nonPurchaseDaysFrom &&
      filters?.nonPurchaseDaysTo &&
      (filters?.nonPurchaseDaysFrom || 0) > (filters?.nonPurchaseDaysTo || 0)
    ) {
      return;
    }

    dispatch(getCustomerListApi(filters))
      .unwrap()
      .catch((error) => {
        setNotification({
          error: error?.error?.message || 'Lỗi khi tải danh sách khách hàng',
        });
      });
  }, [dispatch, filters, setNotification]);

  return (
    <ProTable<ICustomer>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={customers}
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
      hideFooter
    />
  );
};

export default CustomerTable;
