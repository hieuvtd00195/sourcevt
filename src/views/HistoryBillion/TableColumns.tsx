import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import Index from 'components/ProTable/components/Index';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  index: 'ID',
  imageUrl: 'Tên kho hàng',
  code: 'Ngày',
  name: 'Tên nhà vận chuyển',
  markCode: 'Ghi chú',
  importPrice: 'Tên khách hàng',
  costPrice: 'Trạng thái',
  price: 'Giá bán',
  priceVAT: 'Thời Gian Tạo',
  wholesalePrice: 'Giá sỉ',
  inventory: 'Người giao hàng',
  totalInventory: 'Số Km',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  open: () => void;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      Index<any>(pageNumber, pageSize),

      columnHelper.accessor('code', {
        id: 'code',
        size: 160,
        header: () => HEAD_CELLS.code,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 250,
        header: () => HEAD_CELLS.name,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('importPrice', {
        id: 'importPrice',
        size: 250,
        header: () => HEAD_CELLS.importPrice,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.importPrice,
        },
      }),

      columnHelper.accessor('imageUrl', {
        id: 'imageUrl',
        size: 250,
        header: () => HEAD_CELLS.imageUrl,
        cell: (context) => (
          <Typography variant="subtitle2">{'Kho hàng Long Biên'}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.imageUrl,
        },
      }),

      columnHelper.accessor('inventory', {
        id: 'inventory',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.inventory,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.inventory,
        },
      }),
      columnHelper.accessor('totalInventory', {
        id: 'totalInventory',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalInventory,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.totalInventory,
        },
      }),

      columnHelper.accessor('costPrice', {
        id: 'costPrice',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.costPrice,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.costPrice,
        },
      }),
      columnHelper.accessor('markCode', {
        id: 'markCode',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.markCode,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.markCode,
        },
      }),

      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon />,
        cell: (context) => {
          const handleDeleteRow = () => {
            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: (
                <Fragment>
                  Bạn có chắc chắn muốn xóa:{' '}
                  <strong>{context.row.original.name}</strong>
                </Fragment>
              ),
              onConfirm: async () => {},
            });
          };

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa thông tin',
                  value: 1,
                  actionType: 'edit',
                },
                {
                  label: 'Xóa đơn hàng',
                  value: 2,
                  actionType: 'delete',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Ảnh đính kèm',
                  value: 3,
                  actionType: 'save',
                },
                {
                  label: 'Thêm ảnh',
                  value: 4,
                  actionType: 'save',
                },
              ]}
            >
              <ActionIconButton actionType="action" />
            </ProMenu>
          );
        },
      },
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, dialog]);

  return { columns };
};

export default useTableColumns;
