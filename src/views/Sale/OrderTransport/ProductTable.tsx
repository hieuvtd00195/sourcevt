import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getListOrderTransport,
  getListStore,
  getOrderTransport,
  getOrderTransportTotal,
} from 'slices/saleOrderTransport';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import { IOrderTransportList, IRetail } from 'types/retail';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import EditNoteDialog from './UpdateEmployeeDialog';
import UpdateShipperDialog from './UpdateOrderTransport/UpdateShipperDialog';
import UpdateStatusDialog from './UpdateOrderTransport/UpdateStatusDialog';
import { IDataSelectd } from './utils/type';

export interface OrderTransportType {
  [key: string]: any;
}

const ProductTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const [data, setData] = useState<IOrderTransportList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);
  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);
  const [openUpdateShipper, setOpenUpdateShipper] = useState<boolean>(false);
  const [openUpdateStatus, setOpenUpdateStatus] = useState<boolean>(false);
  const [dataSelectd, setDataSelectd] = useState<IDataSelectd | null>(null);

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const navigate = useNavigate();

  const orderTransportList = useSelector(getOrderTransport);
  const orderTransportTotal = useSelector(getOrderTransportTotal);

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  const handleOpenDialog = (value: any) => {
    setOpenDialogInfo(!isOpenDialogInfo);
  };

  const [isOpenDialogEditNote, setOpenDialogEditNote] =
    useState<boolean>(false);

  const handleOpenEditNoteDialog = (value: any) => {
    setOpenDialogEditNote(!isOpenDialogEditNote);
  };

  const handleOpenUpdateShipper = (data: any) => {
    setDataSelectd(data);
    setOpenUpdateShipper(true);
  };

  const handleOpenUpdateStatus = (data: any) => {
    setDataSelectd(data);
    setOpenUpdateStatus(true);
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    handleOpenDialog,
    handleOpenEditNoteDialog,
    handleOpenUpdateShipper,
    handleOpenUpdateStatus,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListOrderTransport(filters));
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
    if (orderTransportList) {
      setData(orderTransportList);
    } else {
      setData([])
    }
    setTotal(orderTransportTotal);
  }, [orderTransportList, orderTransportTotal]);

  useEffect(() => {
    dispatch(getListStore({}))
      .then((res) => { })
      .catch((err) => {
        console.log(err);
      });
    // fetchDataStore();
  }, []);

  const handleCloseUpdateShipper = () => {
    setOpenUpdateShipper(!openUpdateShipper);
  };

  const handleCloseUpdateStatus = () => {
    setOpenUpdateStatus(!openUpdateStatus);
  };

  return (
    <>
      <ProTable<IOrderTransportList>
        title="Danh sách"
        loading={loading}
        columns={columns}
        data={data}
        refetch={refetch}
        onSortingChange={onSortingChange}
        initialstate={{ hiddenColumns: [], hiddenVisibilityColumns: true }}
        pagination={{
          page: filters.pageIndex,
          total,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        hideFooter
        filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
        toolBar={
          <Fragment>
            <ActionButton
              variant="contained"
              actionType="add"
              onClick={() => navigate('create')}
            >
              {t('Thêm mới')}
            </ActionButton>
            <ActionButton
              actionType="download"
              variant="outlined"
              onClick={handleSubmitFilters}
            >
              {t('Xuất file')}
            </ActionButton>
          </Fragment>
        }
      />
      <EditNoteDialog
        open={isOpenDialogEditNote}
        onClose={() => {
          setOpenDialogEditNote(!isOpenDialogEditNote);
          // setDataSelected({});
        }}
      // value={dataSelected}
      />

      <UpdateShipperDialog
        dataSelectd={dataSelectd}
        open={openUpdateShipper}
        onClose={handleCloseUpdateShipper}
        refetch={fetchData}
      />

      <UpdateStatusDialog
        dataSelectd={dataSelectd}
        open={openUpdateStatus}
        onClose={handleCloseUpdateStatus}
        refetch={fetchData}
      />
    </>
  );
};

export default ProductTable;
