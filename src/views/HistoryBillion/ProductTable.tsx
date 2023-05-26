import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DialogRef, FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { Product } from './utils/types';

const DATA = [
  {
    id: 1,
    code: '10/02/2023',
    name: 'A Tiến - 331 Phúc Tân K',
    markCode: 'Phạm Thị Mai Hương',
    importPrice: 'Đức Quang - 434 Bạch Mai (TĐ)',
    costPrice: 'Đang giao',
    price: '772.00',
    priceVAT: '19:14 09/02',
    wholesalePrice: '772.00',
    inventory: 'Khổng Minh Anh',
    totalInventory: 25,
    shipping: 23,
  },
  {
    id: 2,
    code: '10/02/2023',
    name: 'Quang Long - Huế (ĐN',
    markCode: 'Xuan Anh',
    importPrice: 'Đức Quang - 434 Bạch Mai (TĐ)',
    costPrice: 'Chờ giao',
    price: '772.00',
    priceVAT: '19:14 09/02',
    wholesalePrice: '772.00',
    inventory: 'Đặng hùng tuyến',
    totalInventory: 25,
    shipping: 221,
  },
  {
    id: 3,
    code: '10/02/2023',
    name: 'Anh Nam - Hải Dương (TĐ)',
    markCode: 'Luan Luan',
    importPrice: 'Anh Huy - Bắc Giang (TĐ)',
    costPrice: 'Giao hàng thành công',
    price: '772.00',
    priceVAT: '18:59 09/02',
    wholesalePrice: '772.00',
    inventory: 'Nguyễn Văn Đức',
    totalInventory: 51,
    shipping: 45,
  },
  {
    id: 4,
    code: '09/02/2023',
    name: 'A Thịnh - Hưng Yên (TĐ)',
    markCode: 'Luan Kyo',
    importPrice: 'Anh Huy - Bắc Giang (TĐ)',
    costPrice: 'Giao hàng thành công',
    price: '772.00',
    priceVAT: '8:36 09/02',
    wholesalePrice: '772.00',
    inventory: 'Đặng hùng tuyến',
    totalInventory: 11,
    shipping: 11,
  },
  {
    id: 5,
    code: '05/02/2023',
    name: 'Anh Huy - Bắc Giang (TĐ)',
    markCode: 'Thanh Luan',
    importPrice: 'Anh Huy - Bắc Giang (TĐ)',
    costPrice: 'Chờ giao',
    price: '772.00',
    priceVAT: '18:34 09/02',
    wholesalePrice: '772.00',
    inventory: 'A học',
    totalInventory: 15,
    shipping: 22,
  },
  {
    id: 6,
    code: '11/02/2023',
    name: 'Hoàng Triều - Hà Nam (TĐ)',
    markCode: 'Luan Thanh',
    importPrice: 'Anh Nam - Hải Dương (TĐ)',
    costPrice: 'Giao hàng thành công',
    price: '772.00',
    priceVAT: '18:59 09/02',
    wholesalePrice: '772.00',
    inventory: 'Lã Tiến Thành',
    totalInventory: 67,
    shipping: 32,
  },
  {
    id: 7,
    code: '11/02/2023',
    name: 'Đại lý Thương (TĐ)',
    markCode: 'Thu Hương',
    importPrice: 'A Tiến - 331 Phúc Tân KT (TĐ)',
    costPrice: 'Chờ giao',
    price: '772.00',
    priceVAT: '19:12 09/02',
    wholesalePrice: '772.00',
    inventory: 'Kính 7G Trắng',
    totalInventory: 64,
    shipping: 66,
  },
  {
    id: 8,
    code: '05/02/2023',
    name: 'A Tiến - 331 Phúc Tân K',
    markCode: 'Phạm Thị Mai Hương',
    importPrice: 'Anh Huy - Bắc Giang (TĐ)',
    costPrice: 'Chờ giao',
    price: '772.00',
    priceVAT: '19:12 09/02',
    wholesalePrice: '772.00',
    inventory: 'Hoàng Oanh Hiển',
    totalInventory: 32,
    shipping: 2,
  },
];

const ProductTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const [products] = useState<Product[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(products.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const dialogRef = useRef<DialogRef>(null);

  const handleOpenDialog = () => {
    dialogRef.current?.open();
  };

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    open: handleOpenDialog,
  });

  return (
    <>
      <ProTable<any>
        title="Danh sách sản phẩm"
        loading={loading}
        columns={columns}
        data={products}
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
            onClear={handleResetFilters}
          />
        }
        toolBar={
          <Fragment>
            <ProMenu
              position="right"
              items={[
                {
                  label: 'Thêm mới',
                  value: 1,
                  actionType: 'add',
                },
                {
                  label: 'Xuất file chi tiết',
                  value: 2,
                  actionType: 'excel',
                },
                {
                  label: 'Xuất file tổng hợp',
                  value: 3,
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
    </>
  );
};

export default ProductTable;
