import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import React, { useRef, useState } from 'react';
import { FiltersRef } from 'types/refs';
import ActionButton from './components/ActionButton';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IInventoryByProductsType } from './utils/type';

const DATA = [
  {
    code: 'DTK2TP',
    barcode: '2000183841900',
    product: 'Đầu trộn keo',
    currentInventory: 1831,
    totalInventory: 1831,
    quantityBeginningInventory: 2346,
    costBeginningInventory: 1493,
    priceBeginningInventory: 3502578,
    quantityImport: 9010,
    costImport: 1428,
    priceImport: 12866280,
    quantityExport: 9525,
    costExport: 1428,
    priceExport: 13601700,
    quantityEndingInventory: 1831,
    costEndingInventory: 1428,
    priceEndingInventory: 2614668,
  },
];

const Table = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IInventoryByProductsType[]>(DATA);
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
    <ProTable<IInventoryByProductsType>
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
      toolBar={<ActionButton />}
    />
  );
};

export default Table;
