import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IReportRevenueStaff } from '../utils/types';

const columnHelper = getColumnHelper<IReportRevenueStaff>();

const HEAD_CELLS: HeadCell<IReportRevenueStaff> = {
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

  const columns: ProColumn<IReportRevenueStaff> = useMemo(() => {
    return [
      columnHelper.group({
        id: 'order1',
        header: '#',
        columns: [
          {
            id: 'index',
            size: 60,
            maxSize: 60,
            minSize: 60,
            enableSorting: false,
            header: () => '[1]',
            cell: ({ row }) => row.index + 1 + (pageNumber - 1) * pageSize,
            meta: {
              title: '[1]',
            },
          },
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'order',
        header: 'NV bán hàng',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[2]',
            cell: (context) => 'Chưa gắn nhân viên bán hàng',
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
        header: 'Đơn bán',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[3]',
            cell: (context) => 620,
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
        header: 'SP bán',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[4]',
            cell: (context) => 15.765,
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
        header: 'Đơn đặt',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[4A]',
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
        header: 'Đơn trả',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[5]',
            cell: (context) => 20,
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
        header: 'SP trả',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[6]',
            cell: (context) => '1.370',
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
        header: 'Điểm sử dụng',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[10]',
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
        header: 'Chiết khấu',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[11]',
            cell: (context) => '15.000',
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
        header: 'Doanh thu',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[14] = [7] - [8] - [10] - [11] + [13A]',
            cell: (context) => '1.542.622.000	',
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
        header: 'Hoa hồng',
        columns: [
          columnHelper.accessor('name', {
            id: 'name',
            size: 40,
            header: () => '[15]',
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
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
