import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useRef, useState } from 'react';
import { FiltersRef } from 'types/refs';
import useFilters from '../utils/filters';
import { IOrderCODTypes } from '../utils/types';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';

const DATA = [
  {
    customer: 'Nguyễn Văn A',
    store: 'HN',
    transporter: 'VT post',
    cod: '032654',
    status: 'Chờ tiền',
    totalPrice: 200000000,
  },
  {
    customer: 'Nguyễn Văn A',
    store: 'HN',
    transporter: 'VT post',
    cod: '032654',
    status: 'Chờ tiền',
    totalPrice: 200000000,
  },
  {
    customer: 'Nguyễn Văn A',
    store: 'HN',
    transporter: 'VT post',
    cod: '032654',
    status: 'Chờ tiền',
    totalPrice: 200000000,
  },
  {
    customer: 'Nguyễn Văn A',
    store: 'HN',
    transporter: 'VT post',
    cod: '032654',
    status: 'Chờ tiền',
    totalPrice: 200000000,
  },
  {
    customer: 'Nguyễn Văn A',
    store: 'HN',
    transporter: 'VT post',
    cod: '032654',
    status: 'Chờ tiền',
    totalPrice: 200000000,
  },
  {
    customer: 'Nguyễn Văn A',
    store: 'HN',
    transporter: 'VT post',
    cod: '032654',
    status: 'Chờ tiền',
    totalPrice: 200000000,
  },
];

const OrderTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IOrderCODTypes[]>(DATA);
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
    <ProTable<IOrderCODTypes>
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

export default OrderTable;
