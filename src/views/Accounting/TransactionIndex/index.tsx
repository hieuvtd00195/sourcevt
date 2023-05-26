import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DeleteEntryApi,
  getEntryList,
  getEntryListTotal,
  getListEntryApi,
} from 'slices/entry';
import { AppDispatch } from 'store';
import { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { Entry } from './utils/type';
import Logger from 'utils/Logger';
import DownloadFile from 'utils/downloadFiles';
import { APIExportEntry } from 'services/entry';

const Transaction = () => {
  const [refresh, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const entryList = useSelector(getEntryList);
  const totalEntryList = useSelector(getEntryListTotal);
  const [checkReset, setCheckReset] = useState<boolean>(true);
  const setNotification = useNotification();
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onClearFilter,
  } = useFilters();
  const [total, setTotal] = useState<number>(0);
  const [rowIds, setRowIds] = useState<number[]>([]);
  const filtersRef = useRef<FiltersRef>(null);

  const handleEditNote = useCallback(() => {}, []);
  const handleRowSelectionChange = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListEntryApi(filters));
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

  const clearFilter = (value: boolean) => {
    setCheckReset(value);
    onClearFilter();
  };

  useEffect(() => {
    fetchData();
  }, [filters, refresh]);

  useEffect(() => {
    setData(entryList);
    setTotal(totalEntryList);
  }, [entryList]);
  const onDelete = async (id: string | null) => {
    try {
      const response = await dispatch(DeleteEntryApi(id));
    } catch (error) {
      setNotification({
        error: 'Đã xảy ra lỗi',
      });
    } finally {
      refetch();
    }
  };

  const handleExport = async () => {
    try {
      const res = await APIExportEntry(filters);
      const { headers, data } = res;
      DownloadFile.getDownloadBinaryFile(data, headers);
      if (!data) {
        setNotification({
          error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
        });
        return;
      }
    } catch (error) {
      Logger.log(error);
    }
  };

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    handleEditNote,
    onDelete,
  });

  return (
    <Fragment>
      <PageWrapper title="Danh sách bút toán">
        <PageBreadcrumbs
          title="Bút toán"
          items={[
            {
              link: '/accounting/transaction/index',
              text: 'Kế Toán',
            },
          ]}
        />
        <ProTable<Entry>
          title="Danh sách bút toán"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          onRowSelectionChange={handleRowSelectionChange}
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
              checkReset={checkReset}
            />
          }
          toolBar={
            <Fragment>
              <ActionButton
                variant="text"
                onClick={() => clearFilter(!checkReset)}
              >
                Xóa bộ lọc
              </ActionButton>
              <ActionButton
                href="/accounting/transaction/create"
                color="success"
              >
                Thêm mới
              </ActionButton>
              <ProMenu<number>
                position="left"
                items={[
                  {
                    label: 'Xuất Excel',
                    value: 1,
                    actionType: 'excel',
                    onSelect: handleExport,
                  },
                  {
                    label: 'In phiếu đã chọn',
                    value: 2,
                    disabled: rowIds.length === 0,
                    actionType: 'print',
                  },
                ]}
              >
                <ActionButton color="info">Thao tác</ActionButton>
              </ProMenu>
            </Fragment>
          }
          hideFooter
        />
      </PageWrapper>
    </Fragment>
  );
};

export default Transaction;
