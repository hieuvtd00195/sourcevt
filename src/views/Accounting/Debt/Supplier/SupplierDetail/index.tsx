import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { Entry } from './utils/type';
import { useParams } from 'react-router-dom';
import {
  getListDebtSupplierDetail,
  getListDebtSupplierDetailApi,
  getListDebtSupplierDetailTotal,
} from 'slices/debtSupplier';
import { ExportDebtSupplierDetailAPI } from 'services/debtSupplier';
import DownloadFile from 'utils/downloadFiles';
import Logger from 'utils/Logger';

const SupplierDetail = () => {
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const listDebtSupplierDetail = useSelector(getListDebtSupplierDetail);
  const totalDebtSupplierDetailList = useSelector(
    getListDebtSupplierDetailTotal
  );
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

  const { id } = useParams();
  const fetchData = async () => {
    try {
      setLoading(true);
      const newFilters = {
        ...filters,
        supplierId: id,
      };
      const response = await dispatch(getListDebtSupplierDetailApi(newFilters));

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
    setData(listDebtSupplierDetail);
    setTotal(totalDebtSupplierDetailList);
  }, [listDebtSupplierDetail]);

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    handleEditNote,
  });

  const handleExport = async () => {
    try {
      const res = await ExportDebtSupplierDetailAPI(filters);
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

  return (
    <Fragment>
      <PageWrapper title="Chi tiết công nợ nhà cung cấp">
        <PageBreadcrumbs
          title="Chi tiết công nợ nhà cung cấp"
          items={[
            { link: '/accounting/transaction/cash', text: 'Kế toán' },
            { link: '/accounting/debt/customer', text: 'Công nợ' },
          ]}
        />
        <ProTable<Entry>
          title="Chi tiêt công nợ nhà cung cấp"
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
                onClick={handleExport}
                iconPosition="start"
                actionType="upload"
                color="info"
              >
                Xuất excel
              </ActionButton>
            </Fragment>
          }
        />
      </PageWrapper>
    </Fragment>
  );
};

export default SupplierDetail;
