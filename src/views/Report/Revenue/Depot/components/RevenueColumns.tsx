import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IReportRevenueDepot } from '../utils/types';

const columnHelper = getColumnHelper<IReportRevenueDepot>();

const HEAD_CELLS: HeadCell<IReportRevenueDepot> = {
  index: 'ID',
  store: 'Cửa hàng',
  code: 'Mã sản phẩm',
  name: 'Tên sản phẩm',
  markCode: 'Mã vạch',
  importPrice: 'Giá nhập',
  price: 'Giá bán',
  priceVAT: 'Giá bán + VAT',
  wholesalePrice: 'Giá sỉ',
  inventory: 'Tồn',
  totalInventory: 'Tổng tồn',
  actions: 'Hành động',
  sales: 'Doanh số',
  revenue: 'Doanh thu',
  costPrice: 'Giá vốn',
  profit: 'Lợi nhuận',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const columns: ProColumn<IReportRevenueDepot> = useMemo(() => {
    return [
      columnHelper.accessor('time', {
        id: 'time',
        size: 40,
        enableSorting: false,
        header: () => 'Thời gian',
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.time,
        },
      }),
      columnHelper.accessor('store', {
        id: 'store',
        size: 40,
        enableSorting: false,
        header: () => 'Linh kiện Sài Gòn',
        cell: (context) => '1.530.590.000',
        meta: {
          title: HEAD_CELLS.store,
        },
      }),
      columnHelper.accessor('store', {
        id: 'store',
        size: 40,
        enableSorting: false,
        header: () => 'Tổng',
        cell: (context) => '1.530.590.000',
        meta: {
          title: HEAD_CELLS.store,
        },
      }),
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
