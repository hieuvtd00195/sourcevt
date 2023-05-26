import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import { IProductPortfolioTable } from 'types/category';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';

const DATA = [
  {
    id: 1,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'stringst ringstringstringst ringstringstrings tringstringstr ingstringstri ngstringststrings tringstr ingstringring',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
  {
    id: 2,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'string',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
  {
    id: 3,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'string',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
  {
    id: 4,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'string',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
  {
    id: 5,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'string',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
  {
    id: 6,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'string',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
  {
    id: 7,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    ttbh: 'string',
    iconUrl: 'string',
    status: 'string',
    order: 'string',
    total: 'string',
    tyLe: 12,
    person: 'Luân ĐZ',
  },
];

const ProductCategoryTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IProductPortfolioTable[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <ProTable<IProductPortfolioTable>
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
          <ActionButton actionType="search" onClick={handleSubmitFilters}>
            Tìm kiếm
          </ActionButton>
          <ProMenu
            items={[
              { label: 'Thêm mới', to: '/category/add', actionType: 'add' },
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
                value: 1,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'excel',
              },
              {
                label: 'Đổi trạng thái',
                value: 2,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'change',
              },
              {
                label: 'Xóa cache',
                value: 3,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'delete',
              },
              {
                label: 'Xóa các dòng đã chọn',
                value: 4,
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

export default ProductCategoryTable;
