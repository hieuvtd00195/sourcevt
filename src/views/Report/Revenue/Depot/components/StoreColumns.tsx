import Index from 'components/ProTable/components/Index';
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
  const { pageNumber, pageSize } = props;

  const columns: ProColumn<IReportRevenueDepot> = useMemo(() => {
    return [
      Index<IReportRevenueDepot>(pageNumber, pageSize),

      columnHelper.accessor('store', {
        id: 'store',
        size: 40,
        enableSorting: false,
        header: () => HEAD_CELLS.store,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.store,
        },
      }),
      columnHelper.group({
        id: 'order',
        header: 'Đơn hàng',
        columns: [
          columnHelper.accessor('sales', {
            id: 'sales',
            size: 40,
            enableSorting: false,
            header: () => HEAD_CELLS.sales,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.sales,
            },
          }),
          columnHelper.accessor('code', {
            id: 'code',
            size: 40,
            header: () => HEAD_CELLS.revenue,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.code,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.costPrice,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.profit,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'order',
        header: 'Bán lẻ',
        columns: [
          columnHelper.accessor('sales', {
            id: 'sales',
            size: 40,
            enableSorting: false,
            header: () => HEAD_CELLS.sales,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.sales,
            },
          }),
          columnHelper.accessor('code', {
            id: 'code',
            size: 40,
            header: () => HEAD_CELLS.revenue,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.code,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.costPrice,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.profit,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'order',
        header: 'Bán sỉ',
        columns: [
          columnHelper.accessor('sales', {
            id: 'sales',
            size: 40,
            enableSorting: false,
            header: () => HEAD_CELLS.sales,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.sales,
            },
          }),
          columnHelper.accessor('code', {
            id: 'code',
            size: 40,
            header: () => HEAD_CELLS.revenue,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.code,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.costPrice,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.profit,
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'order',
        header: 'Tổng',
        columns: [
          columnHelper.accessor('sales', {
            id: 'sales',
            size: 40,
            enableSorting: false,
            header: () => HEAD_CELLS.sales,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.sales,
            },
          }),
          columnHelper.accessor('code', {
            id: 'code',
            size: 40,
            header: () => HEAD_CELLS.revenue,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.code,
            },
          }),
          columnHelper.accessor('percent', {
            id: 'percent',
            size: 40,
            header: () => '%',
            cell: (context) => '33%',
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => 'm²',
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => 'Doanh thu/m²',
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.costPrice,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => HEAD_CELLS.profit,
            cell: (context) => '1.398.661.000',
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
