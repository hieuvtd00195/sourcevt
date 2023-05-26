import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';

import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { Cash } from './utils/type';
import { useNavigate } from 'react-router-dom';
import useNotification from 'hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getPaymentReceiptList,
  getPaymentReceiptTotal,
  postPaymentReceiptSearch,
} from 'slices/paymentReceipt';
import { APIDeletePaymentReceipt, APIUpdatePaymentReceipt } from 'services/paymentReceipt';

const InventoryTable = () => {
  const [, refetch] = useRefresh();
  const [loading, setLoading] = useState<boolean>(false);

  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [rowIds, setRowIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const [, setEditRowId] = useState<number | null>(null);

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const total = useSelector(getPaymentReceiptTotal);
  const data = useSelector(getPaymentReceiptList);
  // edit note
  const handleEditNote = useCallback((rowId: number, note: string) => {
    setEditRowId(rowId);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await APIDeletePaymentReceipt(id);

      setNotification({
        message: 'Xóa phiếu thu chi thành công',
      });
      fetchData();
    } catch (err) {
      setNotification({
        error: 'Xóa phiếu thu chi không thành công',
      });
    } finally {
    }
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    handleEditNote,
    handleDelete,
  });

  const handleRowSelectionChange = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  const handleCloseChangeStore = () => {};

  useEffect(() => {
    fetchData();
  }, [filters, refetch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(postPaymentReceiptSearch(filters));

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

  return (
    <Fragment>
      <PageWrapper title="Kế toán">
        <PageBreadcrumbs
          title="Thu chi"
          items={[{ link: '/accounting/transaction/index', text: 'Kế toán' }]}
        />
        <ProTable<Cash>
          title="Danh sách giao dịch"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          onRowSelectionChange={handleRowSelectionChange}
          pagination={{
            page: filters.pageIndex,
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
              <ActionButton
                actionType="add"
                onClick={() => navigate('/accounting/addcash')}
              >
                Thêm mới
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
                    label: 'In phiếu đã chọn',
                    value: 2,
                    onSelect: handleCloseChangeStore,
                    disabled: rowIds.length === 0,
                    actionType: 'print',
                  },
                ]}
              >
                <ActionButton color="info">Thao tác</ActionButton>
              </ProMenu>
            </Fragment>
          }
        />
      </PageWrapper>
    </Fragment>
  );
};

export default InventoryTable;
