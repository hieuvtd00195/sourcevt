import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { SupplierProduct } from './utils/type';

const DATA: SupplierProduct[] = [
  {
    id: 1,
    supplier: '01',
    productCode: 'V12PRMTRDE',
    barCode: '	2000211898883',
    productName: 'Vỏ 12PRM 5G Trắng - Đẹp',
    package: '2132',
    codeNCC: '1231312',
    codeProductNCC: '75291',
  },
];

const InventoryTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<SupplierProduct[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [rowIds, setRowIds] = useState<number[]>([]);

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const handleRowSelectionChange = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  return (
    <Fragment>
      <ProTable<SupplierProduct>
        title="Sản phẩm"
        loading={loading}
        columns={columns}
        data={data}
        refetch={refetch}
        onSortingChange={onSortingChange}
        onRowSelectionChange={handleRowSelectionChange}
        pagination={{
          page: filters.pageNumber,
          total,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        initialstate={{
          hiddenVisibilityColumns: true,
          hiddenColumns: [],
        }}
        filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
        toolBar={
          <Fragment>
            <ProMenu<number>
              position="left"
              items={[
                {
                  label: 'Thêm mới',
                  value: 1,
                  to: '/products/addsupplierproduct',
                  actionType: 'add',
                  // onSelect: handleToggleExportInventory,
                },
                {
                  label: 'Nhập từ excel',
                  value: 2,
                  // onSelect: handleCloseChangeStore,
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
                  label: 'Nhập kho',
                  value: 1,
                  // onSelect: handleToggleExportInventory,
                  disabled: rowIds.length === 0,
                  actionType: 'arrowLeft',
                },
                {
                  label: 'Xuất kho',
                  value: 2,
                  // onSelect: handleCloseChangeStore,
                  disabled: rowIds.length === 0,
                  actionType: 'arrowRight',
                },
                {
                  label: 'Xuất excel',
                  value: 3,
                  // onSelect: handleCloseChangeStore,
                  actionType: 'excel',
                },
                {
                  label: 'Xóa các dòng đã chọn',
                  value: 4,
                  color: 'error.main',
                  // onSelect: handleCloseChangeStore,
                  disabled: rowIds.length === 0,
                  actionType: 'delete',
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

export default InventoryTable;
