import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  index: 'ID',
  imageUrl: 'Ảnh',
  code: 'Mã sản phẩm',
  name: 'Tên sản phẩm',
  markCode: 'Mã vạch',
  importPrice: 'Giá nhập',
  costPrice: 'Giá vốn',
  price: 'Giá bán',
  priceVAT: 'Giá bán + VAT',
  wholesalePrice: 'Giá sỉ',
  inventory: 'Tồn',
  totalInventory: 'Tổng tồn',
  actions: 'Hành động',
};

const useTableColumns = () => {
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('imageUrl', {
        id: 'imageUrl',
        size: 150,
        enableSorting: false,
        header: () => 'Sản phẩm',
        cell: (context) => 'CÁP LOA TRONG - Loa đơn 12	',
        meta: {
          title: HEAD_CELLS.imageUrl,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        header: () => 'Số lượng thiếu',
        cell: (context) => '1900',
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 150,
        header: () => 'Số lượng đã trả',
        cell: (context) => '1900',

        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 150,
        header: () => 'Ngày trả',
        cell: (context) => '',

        meta: {
          title: HEAD_CELLS.code,
        },
      }),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  return { columns };
};

export default useTableColumns;
