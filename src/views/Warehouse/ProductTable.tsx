import ActionButton from 'components/ProButton/ActionButton';
import LinkButton from 'components/ProButton/LinkButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteWarehouseTransferBill, getListWarehouseTransfer, getWarehouseTransferList, getWarehouseTransferTotal } from 'slices/warehouseTransfer';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { Product } from './utils/types';
import { IWarehouseTransfer, IWarehouseTransferBillProducts } from 'types/warehouseTransfer';

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

const ProductTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const [products, setProducts] = useState<Product[]>(DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const warehouseTransferList = useSelector(getWarehouseTransferList);
  const totalWarehouseTransferList = useSelector(getWarehouseTransferTotal);

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  const handleDelete = (id: string) => {
    dispatch(deleteWarehouseTransferBill(id))
      .then(() => {
        setNotification({
          message: 'Xóa phiếu chuyển kho thành công',
          severity: 'success',
        });
        fetchData();
      })
      .catch(() =>
        setNotification({
          error: 'Lỗi khi xóa phiếu chuyển kho',
        })
      );
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    handleDelete
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListWarehouseTransfer(filters));
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
    setProducts(warehouseTransferList);
    setTotal(totalWarehouseTransferList);
  }, [totalWarehouseTransferList, warehouseTransferList]);

  return (
    <ProTable<IWarehouseTransfer>
      title="Danh sách chuyển kho"
      loading={loading}
      columns={columns}
      data={products}
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
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <Fragment>
          <LinkButton
            iconPosition="end"
            actionType="add"
            color="success"
            to={'/warehouse/create'}
          >
            {t('Thêm mới')}
          </LinkButton>
          <ProMenu
            position="right"
            items={[
              // {
              //   label: 'Xuất Excel',
              //   value: 1,
              //   actionType: 'excel',
              // },
              // { type: 'divider' },
              // {
              //   label: 'In mã vạch sản phẩm trong các phiếu XNK đã chọn',
              //   value: 2,
              //   actionType: 'print',
              // },
              // { type: 'divider' },
              // {
              //   label: 'In Imeil sản phẩm các phiếu XNK đã chọn',
              //   value: 3,
              //   actionType: 'print',
              // },

              // { type: 'divider' },
              // {
              //   label: 'Gắn nhãn phiếu chuyển kho đã chọn',
              //   value: 8,
              //   actionType: 'tag',
              // },
              // { type: 'divider' },
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

export default ProductTable;
