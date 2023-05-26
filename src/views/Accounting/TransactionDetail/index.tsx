import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEntryList, getEntryListDetail, getEntryListTotal, getListEntryApi, getListEntryDetailApi } from 'slices/entry';
import { AppDispatch } from 'store';
import { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { Entry } from './utils/type';
import { useParams } from 'react-router-dom';

const TransactionDetail = () => {
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const entryListDetail = useSelector(getEntryListDetail);
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

  const handleEditNote = useCallback(() => { }, []);
  const handleRowSelectionChange = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  const { id } = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const newFilters = {
        ...filters,
        parentId: id
      }
      const response = await dispatch(getListEntryDetailApi(newFilters));
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
  }, [filters]);

  useEffect(() => {
    setData(entryListDetail);
    setTotal(totalEntryList);
  }, [entryListDetail]);

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    handleEditNote,
  });

  return (
    <Fragment>
      <PageWrapper title="Chi tiết bút toán">
        <PageBreadcrumbs
          title="Chi tiết bút toán"
          items={[
            {
              link: '/accounting/transaction/index',
              text: 'Kế Toán',
            },
          ]}
        />
        <ProTable<Entry>
          title="Chi tiết bút toán"
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
              {/* <ActionButton
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
              </ProMenu> */}
            </Fragment>
          }
        />
      </PageWrapper>
    </Fragment>
  );
};

export default TransactionDetail;
