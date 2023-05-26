import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IImportTable } from './utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, useTypedSelector } from 'store';
import useNotification from 'hooks/useNotification';
import {
  getListProductWareHousingBill,
  getProductWareHousingList,
  getProductWareHousingListTotal,
  setSelected,
} from 'slices/warehousingslice';
import {
  APIDeleteListProductInBillProduct,
  APIWarehousingProductDelete,
} from 'services/warehousingbill';
import { useSearchParams } from 'react-router-dom';

const ImexProductsTable = () => {
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const productWareHousingList = useSelector(getProductWareHousingList);
  const productWareHousingListTotal = useSelector(
    getProductWareHousingListTotal
  );

  const { selected } = useTypedSelector((state) => state.wareHousing);

  const [loading, setLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IImportTable[]>([]);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || null;

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleDelete = (id: string) => {
    APIWarehousingProductDelete(id)
      .then(() => {
        setNotification({
          message: 'Xóa sản phẩm xuất nhập kho thành công',
          severity: 'success',
        });
        fetchData();
      })
      .catch((error) => {
        setNotification({
          error: error.error.message || 'Lỗi khi xóa sản phẩm xuất nhập kho',
        });
      });
  };

  const handleDeleteRows = async () => {
    try {
      await APIDeleteListProductInBillProduct(
        selected.map((_item) => _item.id)
      );
      fetchData();
      dispatch(setSelected([]));
      setNotification({
        message: 'Xóa nhiều sản phẩm xuất nhập kho thành công',
        severity: 'success',
      });
    } catch (error) {
      setNotification({ error: 'Lỗi khi xóa nhiều sản phẩm xuất nhập kho' });
    }
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    handleDelete,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListProductWareHousingBill(filters));
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
    setProductList(productWareHousingList);
    setTotal(productWareHousingListTotal);
  }, [productWareHousingList]);

  return (
    <ProTable<IImportTable>
      loading={loading}
      columns={columns}
      data={productList}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageIndex,
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
          codeQueryURL={codeQueryURL}
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <Fragment>
          <ActionButton variant="text" onClick={filtersRef.current?.reset}>
            Xóa bộ lọc
          </ActionButton>
          {/* <ProMenu
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
          </ProMenu> */}
          <ProMenu
            items={[
              // {
              //   label: 'In mã vạch sản phẩm đã chọn',
              //   value: 2,
              //   onSelect: () => {
              //     console.log('hihi');
              //   },
              //   actionType: 'print',
              // },
              {
                label: 'Xóa sản phẩm xuất nhập kho',
                value: 4,
                onSelect: handleDeleteRows,
                actionType: 'delete',
              },
              {
                label: 'Xuất Excel',
                value: 1,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'excel',
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {'Thao tác'}
            </ActionButton>
          </ProMenu>
        </Fragment>
      }
      hideFooter
    />
  );
};

export default ImexProductsTable;
