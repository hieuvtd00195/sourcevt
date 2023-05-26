import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { ISellingByStoreTable } from './utils/types';

const DATA = [
  {
    id: 1,
    product: 'Lõi pin XSM',
    price: { sell: 903323, pay: 130000 },
    sell: 1111111,
    pay: 234567,
  },
  {
    id: 2,
    product: 'Lõi pin XSM',
    price: { sell: 903323, pay: 130000 },
    sell: 1111111,
    pay: 234567,
  },
  {
    id: 3,
    product: 'Lõi pin XSM',
    price: { sell: 903323, pay: 130000 },
    sell: 1111111,
    pay: 234567,
  },
  {
    id: 4,
    product: 'Lõi pin XSM',
    price: { sell: 903323, pay: 130000 },
    sell: 1111111,
    pay: 234567,
  },
  {
    id: 5,
    product: 'Lõi pin XSM',
    price: { sell: 903323, pay: 130000 },
    sell: 1111111,
    pay: 234567,
  },
];

const SellingByStoreTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<ISellingByStoreTable[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  console.log(filters);

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { totalColumns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    dataDynamicCol: filters.store,
  });

  return (
    <ProTable<ISellingByStoreTable>
      loading={loading}
      columns={totalColumns}
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
        <Fragment>
          <ProMenu
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'excel',
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {'Thao tác'}
            </ActionButton>
          </ProMenu>
        </Fragment>
      }
    />
  );
};

export default SellingByStoreTable;
