import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';

import { AppDispatch } from 'store';
import { useDispatch, useSelector } from 'react-redux';

import { getListProduct, getProductsList } from 'slices/products';
import { APIExportProduct } from 'services/products';
import useNotification from 'hooks/useNotification';
import DownloadFile from 'utils/downloadFiles';
import Logger from 'utils/Logger';

const ProductTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const masterDataLisProducts = useSelector(getProductsList);
  const [, refetch] = useRefresh();
  const [loading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);

  const {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onClearFilter,
  } = useFilters();

  const fetchMasterDataProducts = async () => {
    const body = {
      orderBy: filters.sortBy ?? null,
      orderDirection: filters.sortBy ?? null,
      pageIndex: filters.pageNumber,
      pageSize: filters.pageSize,
      storeIds: filters.storeIds ?? [],
      productCategoryIds: filters.productCategoryIds ?? [],
      productCode: filters.productCode ?? null,
      productName: filters.productName ?? null,
      inventoryFilter: filters.inventoryFilter
        ? Number(filters.inventoryFilter)
        : null,
      status: filters.status ? Number(filters.status) : null,
      inventorystatus: filters.inventorystatus
        ? Number(filters.inventorystatus)
        : null,
    };

    try {
      const response: any = await dispatch(getListProduct(body));
      setTotal(response.payload.total);
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    fetchMasterDataProducts();
  }, [filters, refetch]);

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };
  const clearFilter = (values: any) => {
    // setCheckReset(value);
    onClearFilter(values);
  };
  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const handleExportExcel = async () => {
    if (!total) {
      setNotification({
        error: 'Không có dữ liệu để xuất file Excel',
      });

      return;
    }

    try {
      const res = await APIExportProduct(filters);
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
  };
  return (
    <ProTable<any>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={masterDataLisProducts}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageNumber,
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
          onClear={clearFilter}
        />
      }
      toolBar={
        <Fragment>
          <ActionButton variant="text" onClick={filtersRef.current?.reset}>
            Xóa bộ lọc
          </ActionButton>
          <ProMenu
            position="right"
            items={[
              {
                label: 'Thêm mới',
                value: 1,
                actionType: 'add',
                to: '/products/create',
              },
              // {
              //   label: 'Nhập từ Excel',
              //   value: 2,
              //   actionType: 'excel',
              // },
              // {
              //   label: 'Nhập từ Excel sản phẩm Combo',
              //   value: 3,
              //   actionType: 'excel',
              // },
            ]}
          >
            <ActionButton
              iconPosition="end"
              actionType="expand"
              color="success"
            >
              {t('Thêm mới')}
            </ActionButton>
          </ProMenu>
          <ProMenu
            position="right"
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                actionType: 'excel',
                onSelect: handleExportExcel,
              },
              {
                label: 'In mã vạch',
                value: 2,
                actionType: 'print',
              },
              {
                label: 'Đổi trạng thái sản phẩm',
                value: 3,
                actionType: 'sync',
              },
              {
                label: 'Xem giá sản phẩm theo chi nhánh',
                value: 8,
                actionType: 'tree',
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

export default ProductTable;
