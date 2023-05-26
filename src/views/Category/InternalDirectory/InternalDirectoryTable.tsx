import { Button } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import { IInternalDirectoryTable } from 'types/category';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DATA = [
  {
    id: 1,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
  {
    id: 2,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
  {
    id: 3,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
  {
    id: 4,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
  {
    id: 5,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
  {
    id: 6,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
  {
    id: 7,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    status: '772.00',
    parentId: 'abc',
    creator: 'admin',
    total: '25',
  },
];

const InternalDirectoryTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IInternalDirectoryTable[]>(DATA);
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
    <ProTable<IInternalDirectoryTable>
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
      filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
      toolBar={
        <Fragment>
          <ActionButton variant="text" onClick={handleResetFilters}>
            Xóa bộ lọc
          </ActionButton>
          <ActionButton actionType="search" onClick={handleSubmitFilters}>
            Tìm kiếm
          </ActionButton>
          <ProMenu
            items={[
              { label: 'Thêm mới', to: '/category/create', actionType: 'add' },
              {
                label: 'Nhập từ Excel',
                to: '/category/import-excel',
                actionType: 'add',
              },
            ]}
          >
            <Button startIcon={<KeyboardArrowDownIcon />}>Thêm mới</Button>
          </ProMenu>
          <ProMenu
            items={[
              {
                label: 'Xuất Excel',
                value: 'Ex',
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'excel',
              },
              {
                label: 'Xóa các dòng đã chọn',
                value: 'Delete',
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'delete',
              },
            ]}
          >
            <Button startIcon={<KeyboardArrowDownIcon />}>Thao tác</Button>
          </ProMenu>
        </Fragment>
      }
    />
  );
};

export default InternalDirectoryTable;
