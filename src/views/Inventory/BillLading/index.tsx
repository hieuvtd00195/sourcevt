import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { transportOrder } from './utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import useNotification from 'hooks/useNotification';
import {
  getListOrderTransport,
  getOrderTransportList,
  getOrderTransportTotal,
} from 'slices/orderTransport';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import { useTranslation } from 'react-i18next';
import LinkButton from 'components/ProButton/LinkButton';
import { useSearchParams } from 'react-router-dom';
import { APIExportOrderTransport } from 'services/orderTransport';
import { downloadBase64File } from 'utils/downloadBase64File';
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

const BillLading = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const orderTransportList = useSelector(getOrderTransportList);
  const orderTransportTotal = useSelector(getOrderTransportTotal);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<transportOrder[]>([]);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
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
    const dataClone = orderTransportList.map((item, index) => {
      let order = (filters.pageIndex - 1) * filters.pageSize + index + 1;
      return {
        ...item,
        order: order,
      };
    });
    setOrderList(dataClone);
    setTotal(orderTransportTotal);
  }, [orderTransportList]);

  const handleExportExcel = async () => {
    try {
      await APIExportOrderTransport(filters);
    } catch (error) {
      Logger.log(error);
      setNotification({
        error: 'Lỗi khi xuất dữ liệu!',
      });
    }
  };

  return (
    <ProTable<any>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={orderList}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageIndex,
        total,
        pageSize: filters.pageSize,
        onPageChange,
        onPageSizeChange,
      }}
      initialstate={{ hiddenVisibilityColumns: true, hiddenColumns: [] }}
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
          <ActionButton variant="text" onClick={filtersRef.current?.reset}>
            Xóa bộ lọc
          </ActionButton>
          {/* <ActionButton
            iconPosition="end"
            actionType="add"
            color="success"
            onClick={handleAdd}
          >
            {t('Thêm mới')}
          </ActionButton> */}
          <ProMenu
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                onSelect: () => handleExportExcel(),
                actionType: 'excel',
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

export default BillLading;
