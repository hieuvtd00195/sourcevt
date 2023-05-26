import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
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

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('imageUrl', {
        id: 'imageUrl',
        size: 120,
        enableSorting: false,
        header: () => 'Tên nhà cung cấp',
        cell: (context) => 'NCC 45',
        meta: {
          title: HEAD_CELLS.imageUrl,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 90,
        header: () => 'Số hóa đơn',
        cell: (context) => '',
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 80,
        header: () => 'Ngày trả',
        cell: (context) => '',
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        header: () => 'Tên sản phẩm thiếu',
        cell: (context) => 'MÀN GX XS',
        meta: {
          title: HEAD_CELLS.name,
        },
      }),

      columnHelper.accessor('costPrice', {
        id: 'costPrice',
        size: 90,
        enableSorting: false,
        header: () => 'SL thiếu',
        cell: (context) => '44',
        meta: {
          title: HEAD_CELLS.costPrice,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 80,
        header: () => 'SL đã trả',
        cell: (context) => '0',
        meta: {
          title: HEAD_CELLS.price,
        },
      }),

      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa',
                  value: 2,
                  actionType: 'edit',
                },
                {
                  label: 'Chi tiết',
                  value: 2,
                  actionType: 'view',
                },
                {
                  label: 'Xóa',
                  value: 2,
                  actionType: 'delete',
                },
              ]}
            >
              <ActionIconButton actionType="action" />
            </ProMenu>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, dialog]);

  return { columns };
};

export default useTableColumns;
