import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  deleteWarehouseTransferMoving,
  exportWarehouseTransferMoving,
  searchWarehouseTransferMoving,
} from 'slices/warehouseDelivering';
import { useTypedDispatch, useTypedSelector } from 'store';
import type { FiltersRef } from 'types/refs';
import { WarehouseTransferMoving } from 'types/warehouseDelivering';
import DownloadFile from 'utils/downloadFiles';
import FiltersForm from './FiltersForm';
import useTableColumnsDelivering from './TableColumns';
import useFilters from './utils/filters';
import { APIExportWarehouseTransferMoving } from 'services/warehouseDelivering';
import Logger from 'utils/Logger';

const Delivering = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();
  const { WarehouseTransferMovingList, total, loading, selected } =
    useTypedSelector((state) => state.warehouseDelivering);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const fetchData = useCallback(() => {
    dispatch(searchWarehouseTransferMoving(filters))
      .unwrap()
      .catch(() => {
        setNotification({
          error: 'Lỗi khi tải danh sách phiếu đang di chuyển',
        });
      });
  }, [dispatch, filters, setNotification]);

  const handleExport = async () => {
    // APIExportWarehouseTransferMoving
    try {
      const res = await APIExportWarehouseTransferMoving(filters);
      const { headers, data } = res;
      DownloadFile.getDownloadBinaryFile(data, headers);
      if (!data) {
        setNotification({
          error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
        });

        return;
      }
      // const { base64Data, fileName, fileType } = data;
      // downloadBase64File(base64Data, fileName, fileType);
    } catch (error) {
      Logger.log(error);
    }
    // dispatch(exportWarehouseTransferMoving(filters))
    //   .unwrap()
    //   .then((res) => {
    //     const { headers, data } = res;
    //     DownloadFile.getDownloadBinaryFile(res, {
    //       'content-disposition': 'xlsx',
    //     });
    //     if (!data) {
    //       setNotification({
    //         error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
    //       });

    //       return;
    //     }
    //   })
    //   .catch(() => {
    //     setNotification({
    //       error: 'Lỗi khi xuất danh sách phiếu đang di chuyển',
    //     });
    //   });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteWarehouseTransferMoving(id))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Xóa phiếu đang di chuyển thành công',
          severity: 'success',
        });
        fetchData();
      })
      .catch((error) => {
        setNotification({
          error: error?.error?.message || 'Lỗi khi xóa phiếu đang di chuyển',
        });
      });
  };

  const handleDeleteByIds = () => {
    console.log('selected', selected);
  };

  const { columns } = useTableColumnsDelivering({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleDelete,
  });

  useEffect(() => {
    fetchData();
  }, [dispatch, fetchData, filters, setNotification]);

  return (
    <ProTable<WarehouseTransferMoving>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={WarehouseTransferMovingList}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageIndex || 1,
        total,
        pageSize: filters.pageSize,
        onPageChange,
        onPageSizeChange,
      }}
      filter={
        <FiltersForm
          ref={filtersRef}
          onSearch={onSearch}
          onSubmit={handleSubmitFilters}
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <Fragment>
          <ActionButton iconPosition="end" actionType="expand" color="success">
            {t('Thêm mới')}
          </ActionButton>
          <ProMenu
            position="right"
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                actionType: 'excel',
                onSelect: handleExport,
              },
              { type: 'divider' },
              {
                label: 'In mã vạch sản phẩm trong các phiếu XNK đã chọn',
                value: 2,
                actionType: 'print',
              },
              { type: 'divider' },
              {
                label: 'In Imeil sản phẩm các phiếu XNK đã chọn',
                value: 3,
                actionType: 'print',
              },

              { type: 'divider' },
              {
                label: 'Gắn nhãn phiếu chuyển kho đã chọn',
                value: 8,
                actionType: 'tag',
              },
              { type: 'divider' },
              {
                label: 'Xóa các dòng đã chọn',
                value: 7,
                actionType: 'delete',
                color: 'error.main',
                onSelect: handleDeleteByIds,
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {t('Thao tác')}
            </ActionButton>
          </ProMenu>
        </Fragment>
      }
      hideFooter
    />
  );
};

export default Delivering;
