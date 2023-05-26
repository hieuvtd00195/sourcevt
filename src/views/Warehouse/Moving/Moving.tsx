import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteMovingWarehouseTransfer,
  getListMovingWarehouseTransfer,
  getWarehouseTransferMovingList,
  getWarehouseTransferTotal,
} from 'slices/warehouseTransfer';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import type { Product } from '../utils/types';
import FiltersForm from './FiltersForm';
import useTableColumnsMoving from './TableColumns';
import useFilters from './utils/filters';
import { APIExportWarehouseTransferComing } from 'services/warehouseTransfer';
import DownloadFile from 'utils/downloadFiles';
import Logger from 'utils/Logger';

const DATA = [
  {
    id: 1,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 23,
  },
  {
    id: 2,
    code: 'A12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 221,
  },
  {
    id: 3,
    code: 'G12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 22,
    totalInventory: 25,
    shipping: 45,
  },
  {
    id: 4,
    code: 'HV12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 11,
  },
  {
    id: 5,
    code: 'L12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 10,
    totalInventory: 25,
    shipping: 22,
  },
  {
    id: 6,
    code: 'E12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 5,
    totalInventory: 25,
    shipping: 32,
  },
  {
    id: 7,
    code: 'C12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 25,
    totalInventory: 25,
    shipping: 66,
  },
  {
    id: 8,
    code: 'M12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 3,
    totalInventory: 25,
    shipping: 2,
  },
];

const Moving = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(products.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const warehouseTransferMovingList = useSelector(
    getWarehouseTransferMovingList
  );
  const totalWarehouseTransferMovingList = useSelector(
    getWarehouseTransferTotal
  );

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMovingWarehouseTransfer(id))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Xóa phiếu sắp chuyển đến thành công',
          severity: 'success',
        });
        fetchData();
      })
      .catch((error) => {
        setNotification({
          error: error.error.message || 'Lỗi khi xóa phiếu sắp chuyển đến',
        });
      });
  };

  const handleExportExcel = async () => {
    if (!total) {
      setNotification({
        error: 'Không có dữ liệu để xuất file Excel',
      });

      return;
    }

    try {
      const res = await APIExportWarehouseTransferComing(filters);

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

  const { columns } = useTableColumnsMoving({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleDelete,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListMovingWarehouseTransfer(filters));
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
    setProducts(warehouseTransferMovingList);
    setTotal(totalWarehouseTransferMovingList);
  }, [warehouseTransferMovingList]);

  return (
    <ProTable<any>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={products}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageIndex ?? 1,
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
                onSelect: handleExportExcel,
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
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {t('Thao tác')}
            </ActionButton>
          </ProMenu>
        </Fragment>
      }
    />
  );
};

export default Moving;
