import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useRef, useState } from 'react';
import { FiltersRef } from 'types/refs';
import useFilters from '../utils/filter';
import { IReportRevenueCustomer } from '../utils/type';
import FiltersForm from './FitersForm';
import useTableColumns from './TableColumns';

const DATA = [
  {
    id: '1',
    customer: 'Nguyễn Văn A',
    phoneNumber: '0123456789',
    order: 1,
    bills: 2,
    totalPurchase: 3000,
    returnInvoice: 0,
    totalReturn: 0,
    productsPurchased: 200,
    productsReturned: 0,
    accumulatedPoints: 0,
    usedPoints: 0,
    discount: 0,
    revenue: 200000000,
    price: 150000000,
    profit: 50000000,
  },
];

const CustomerTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IReportRevenueCustomer[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
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

  return (
    <ProTable<IReportRevenueCustomer>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={banners}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageNumber,
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
        <ActionButton iconPosition="end" actionType="upload" color="info">
          Xuất Excel
        </ActionButton>
      }
    />
  );
};

export default CustomerTable;
