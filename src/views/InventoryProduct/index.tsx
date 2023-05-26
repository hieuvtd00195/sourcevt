import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import ConfirmChangeProvider from './components/ConfirmChangeProvider';
import ConfirmChangeStore from './components/ConfirmChangeStore';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { Inventory } from './utils/type';
import { getListInventory, inventoryTotal, listInventory, storeInventory } from 'slices/inventory';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import useNotification from 'hooks/useNotification';

const InventoryTable = () => {
  const [, refetch] = useRefresh();
  const [data, setData] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch, onClearFilter } =
    useFilters();
  const setNotification = useNotification()
  const [checkReset, setCheckReset] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const inventoryData = useSelector(listInventory);
  const totalData = useSelector(inventoryTotal);

  const [rowIds, setRowIds] = useState<number[]>([]);
  const [openConfirmChangeStore, setOpenConfirmChangeStore] =
    useState<boolean>(false);
  const [openConfirmChangeProvider, setOpenConfirmChangeProvider] =
    useState<boolean>(false);
  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const handleRowSelectionChange = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  const handleCloseChangeStore = () => {
    setOpenConfirmChangeStore((prev) => !prev);
  };

  const handleCloseChangeProvider = () => {
    setOpenConfirmChangeProvider((prev) => !prev);
  };

  const confirmChangeStore = (store: number | null) => { };

  const confirmChangeProvider = (store: number | null) => { };

  const clearFilter = (value: boolean) => {
    setCheckReset(value);
    onClearFilter();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListInventory(filters));

      if (!response.payload) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
    } catch (error) {
      setNotification({
        error: 'Lỗi khi lấy dữ liệu!',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, refetch]);


  useEffect(() => {
    setData(inventoryData);
    setTotal(totalData);
  }, [inventoryData, totalData]);


  return (
    <Fragment>
      <PageWrapper title="Tồn kho">
        <PageBreadcrumbs
          title="Tồn kho"
          items={[{ link: '/products/item/index', text: 'Sản phẩm' }]}
        />
        <ProTable<Inventory>
          title="Danh sách sản phẩm"
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
          filter={<FiltersForm ref={filtersRef} onSearch={onSearch} checkReset={checkReset} />}
          toolBar={
            <Fragment>
              <ActionButton variant="text" onClick={() => clearFilter(!checkReset)}>
                Xóa bộ lọc
              </ActionButton>
              <ProMenu<number>
                position="left"
                items={[
                  {
                    label: 'Xuất Excel',
                    value: 1,
                    // onSelect: handleToggleExportInventory,
                    actionType: 'excel',
                  },
                  {
                    label: 'Thêm phiếu chuyển kho',
                    value: 2,
                    onSelect: handleCloseChangeStore,
                    disabled: rowIds.length === 0,
                    actionType: 'add',
                  },
                  {
                    label: 'Thêm yêu cầu nhà cung cấp',
                    value: 3,
                    onSelect: handleCloseChangeProvider,
                    disabled: rowIds.length === 0,
                    actionType: 'add',
                  },
                ]}
              >
                <ActionButton color="info">Thao tác</ActionButton>
              </ProMenu>
            </Fragment>
          }
        />
      </PageWrapper>
      <ConfirmChangeStore
        open={openConfirmChangeStore}
        onClose={handleCloseChangeStore}
        confirmChange={confirmChangeStore}
      />
      <ConfirmChangeProvider
        open={openConfirmChangeProvider}
        onClose={handleCloseChangeProvider}
        confirmChange={confirmChangeProvider}
      />
    </Fragment>
  );
};

export default InventoryTable;
