import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import { TableRef } from 'components/ProTable/types/refs';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APIDeleteWareHousingBillById } from 'services/warehousingbill';
import {
  getListWareHousingBill,
  getWareHousingList,
} from 'slices/warehousingslice';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import Logger from 'utils/Logger';
import ConfirmChangeStore from 'views/Accounting/Cash/components/ConfirmChangeStore';
import EditNote from 'views/Accounting/Cash/components/EditNote';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IImportExport } from './utils/types';
import { useSearchParams } from 'react-router-dom';

const BillTable = () => {
  const [refresh, refetch] = useRefresh();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const tableRef = useRef<TableRef>(null);
  const filtersRef = useRef<FiltersRef>(null);
  const [wareHousingList, setWareHousingList] = useState<IImportExport[]>([]);
  const [checkReset, setCheckReset] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onClearFilter,
  } = useFilters();

  const [openEditNote, setEditNote] = useState<boolean>(false);
  const [, setEditRowId] = useState<number | null>(null);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [openConfirmChangeStore, setOpenConfirmChangeStore] =
    useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || null;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListWareHousingBill(filters));
      setWareHousingList(response.payload.data);
      setTotal(response.payload.total);
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
  }, [filters, refresh]);

  // edit note
  const handleEditNote = useCallback((rowId: number, note: string) => {
    setEditNote(true);
    setEditRowId(rowId);
    setValue(note);
  }, []);

  const handleCloseEditNote = () => {
    setEditNote(false);
    setEditRowId(null);
  };

  const confirmEditNote = (price: string) => { };

  const handleCloseChangeStore = () => {
    setOpenConfirmChangeStore((prev) => !prev);
  };

  const confirmChangeStore = (store: number | null) => { };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => async () => {
      try {
        await APIDeleteWareHousingBillById(rowId);

        setNotification({
          message: 'Xóa đơn hàng thành công',
          severity: 'success',
        });

        tableRef.current?.stopRowEditMode(rowId);
        refetch();
      } catch (error) {
        Logger.log(error);
      }
    },
    [refetch, setNotification]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    handleEditNote,
    onDelete: handleRemoveRow,
  });
  const clearFilter = (values: any) => {
    // setCheckReset(value);
    onClearFilter(values);
  };
  return (
    <>
      <ProTable<IImportExport>
        loading={loading}
        ref={tableRef}
        columns={columns}
        data={wareHousingList}
        refetch={refetch}
        onSortingChange={onSortingChange}
        hideFooter={true}
        initialstate={{ hiddenColumns: [], hiddenVisibilityColumns: true }}
        pagination={{
          total,
          page: filters.pageIndex,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        filter={
          <FiltersForm
            ref={filtersRef}
            onSearch={onSearch}
            onSubmit={handleSubmitFilters}
            codeQueryURL={codeQueryURL}
            onClear={clearFilter}
          />
        }
        toolBar={
          <Fragment>
            <ActionButton variant="text" onClick={filtersRef.current?.reset}>
              Xóa bộ lọc
            </ActionButton>
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
                  label: 'Xuất Excel',
                  value: 1,
                  onSelect: () => {
                    console.log('hihi');
                  },
                  actionType: 'excel',
                },
                {
                  label: 'In các phiếu XNK đã chọn',
                  value: 2,
                  onSelect: () => {
                    console.log('hihi');
                  },
                  actionType: 'print',
                },
                {
                  label: 'Gán nhãn phiếu XNK đã chọn',
                  value: 3,
                  onSelect: () => {
                    console.log('hihi');
                  },
                  actionType: 'tags',
                },
                {
                  label: 'Xóa các phiếu XNK đã chọn',
                  value: 4,
                  onSelect: () => {
                    console.log('hihi');
                  },
                  actionType: 'delete',
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
      <ConfirmChangeStore
        open={openConfirmChangeStore}
        onClose={handleCloseChangeStore}
        confirmChange={confirmChangeStore}
      />
      <EditNote
        open={openEditNote}
        onClose={handleCloseEditNote}
        confirmChange={confirmEditNote}
        value={value}
      />
    </>
  );
};

export default BillTable;
