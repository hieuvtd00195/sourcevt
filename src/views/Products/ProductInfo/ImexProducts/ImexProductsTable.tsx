import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IImportExport } from './utils/types';

const DATA = [
  {
    id: 1,
    idAndDay: { id: 976876, day: '02/05' },
    warehouse: { name: 'Linh kiện Sài Gòn', type: 'Xuất bán lẻ' },
    productCode: 'PZP3',
    product: 'Pin 8P Zin',
    quantity: 23,
    inventory: 566,
    price: 1333333,
    costPrice: 2321313,
    money: 3131231,
    totalMoney: 1111111,
    creator: 'string',
    note: 'string',
  },
  {
    id: 2,
    idAndDay: { id: 976876, day: '02/05' },
    warehouse: { name: 'Linh kiện Sài Gòn', type: 'Xuất bán lẻ' },
    productCode: 'PZP3',
    product: 'Pin 8P Zin',
    quantity: 23,
    inventory: 566,
    price: 1333333,
    costPrice: 2321313,
    money: 3131231,
    totalMoney: 1111111,
    creator: 'string',
    note: 'string',
  },
  {
    id: 3,
    idAndDay: { id: 976876, day: '02/05' },
    warehouse: { name: 'Linh kiện Sài Gòn', type: 'Xuất bán lẻ' },
    productCode: 'PZP3',
    product: 'Pin 8P Zin',
    quantity: 23,
    inventory: 566,
    price: 1333333,
    costPrice: 2321313,
    money: 3131231,
    totalMoney: 1111111,
    creator: 'string',
    note: 'string',
  },
  {
    id: 4,
    idAndDay: { id: 976876, day: '02/05' },
    warehouse: { name: 'Linh kiện Sài Gòn', type: 'Xuất bán lẻ' },
    productCode: 'PZP3',
    product: 'Pin 8P Zin',
    quantity: 23,
    inventory: 566,
    price: 1333333,
    costPrice: 2321313,
    money: 3131231,
    totalMoney: 1111111,
    creator: 'string',
    note: 'string',
  },
];

const ImexProductsTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IImportExport[]>(DATA);
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
    <ProTable<IImportExport>
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
        <Fragment>
          <ProMenu
            items={[
              {
                label: 'Nhập kho',
                to: '/inventory/bill/import',
                actionType: 'arrowLeft',
              },
              {
                label: 'Xuất kho',
                to: '/inventory/bill/export',
                actionType: 'arrowRight',
              },
            ]}
          >
            <ActionButton
              iconPosition="end"
              actionType="expand"
              color="success"
            >
              {'Thêm mới'}
            </ActionButton>
          </ProMenu>
          <ProMenu
            items={[
              {
                label: 'In mã vạch sản phẩm đã chọn',
                value: 2,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'print',
              },
              {
                label: 'Xóa sản phẩm xuất nhập kho',
                value: 4,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'delete',
              },
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

export default ImexProductsTable;
