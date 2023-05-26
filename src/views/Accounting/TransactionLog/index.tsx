// @ts-nocheck
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import useFilters from './utils/filters';
import { TransactionHistory } from './utils/type';
import FiltersForm from './FiltersForm';
import ProMenu from 'components/ProMenu';
import ActionButton from 'components/ProButton/ActionButton';
import useTableColumns from './TableColumns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { getEntryListTotal, getEntryLogList, getListEntryLogApi } from 'slices/entry';
import useNotification from 'hooks/useNotification';
import DetailLogTable from './DetailLogTable';
import type { DialogRef } from 'types/refs';
import { IHistory } from 'views/HistoryAccount/utils/types';

const TransactionLog = () => {
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<TransactionHistory[]>([]);
  const [total, setTotal] = useState<number>(data.length || 0);
  const [loading, setLoading] = useState<boolean>(false);
  const entryLogList = useSelector(getEntryLogList);
  const setNotification = useNotification();
  const totalEntryLogList = useSelector(getEntryListTotal)
  const [checkReset, setCheckReset] = useState<boolean>(true);

  const {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onClearFilter
  } =
    useFilters();

  const clearFilter = (value: boolean) => {
    setCheckReset(value);
    onClearFilter();
  };
  const dialogRef = useRef<DialogRef>(null);

  const [dataSelect, setDataSelect] = useState<IHistory>({});
  const handleOpenDialog = (data: IHistory) => {
    setDataSelect(data);
    dialogRef.current?.open();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    open: handleOpenDialog,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListEntryLogApi(filters));
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
  }, [filters]);

  useEffect(() => {
    setData(entryLogList);
    setTotal(totalEntryLogList);
  }, [entryLogList]);


  return (
    <Fragment>
      <PageWrapper title="Lịch sử">
        <PageBreadcrumbs
          title="Lịch sử"
          items={[
            {
              link: '/accounting/transaction/index',
              text: 'Kế toán',
            },
            {
              link: '/accounting/transaction/log',
              text: 'Bút toán',
            },
          ]}
        />
        <ProTable<TransactionHistory>
          title="Lịch sử"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          onRowSelectionChange={() => null}
          pagination={{
            total,
            page: filters.pageIndex,
            pageSize: filters.pageSize,
            onPageChange,
            onPageSizeChange,
          }}
          filter={<FiltersForm onSearch={onSearch} checkReset={checkReset} />}
          toolBar={
            <Fragment>

              <ActionButton
                variant="text"
                onClick={() => clearFilter(!checkReset)}
              >
                Xóa bộ lọc
              </ActionButton>
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
        <DetailLogTable ref={dialogRef} dataSelect={dataSelect} />
      </PageWrapper>
    </Fragment>
  );
};

export default TransactionLog;
