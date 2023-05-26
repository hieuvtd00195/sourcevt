import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { Supplier } from './utils/type';

const DATA: Supplier[] = [
  {
    id: 1,
    code: '12',
    name: '02',
    type: 1,
    phone: '2312312',
    creator: 'lkvtech',
    status: 1,
  },
  {
    id: 2,
    code: '12',
    name: '02',
    type: 2,
    phone: '2312312',
    creator: 'lkvtech',
    status: 2,
  },
];

const SupplierTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<Supplier[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <Fragment>
      <ProTable<Supplier>
        title="Danh sách giao dịch"
        loading={loading}
        columns={columns}
        data={data}
        refetch={refetch}
        onSortingChange={onSortingChange}
        pagination={{
          page: filters.pageNumber,
          total,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        initialstate={{ hiddenVisibilityColumns: true, hiddenColumns: [] }}
        filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
        toolBar={
          <Fragment>
            <ProMenu<number>
              position="left"
              items={[
                {
                  label: 'Thêm nhà cung cấp',
                  value: 1,
                  to: '/products/addsupplier',
                  actionType: 'add',
                },
                {
                  label: 'Nhập từ excel',
                  value: 2,
                  actionType: 'print',
                },
              ]}
            >
              <ActionButton color="success">Thêm mới</ActionButton>
            </ProMenu>
            <ProMenu<number>
              position="left"
              items={[
                {
                  label: 'Xuất Excel',
                  value: 1,
                  actionType: 'excel',
                },
              ]}
            >
              <ActionButton color="info">Thao tác</ActionButton>
            </ProMenu>
          </Fragment>
        }
      />
    </Fragment>
  );
};

export default SupplierTable;
