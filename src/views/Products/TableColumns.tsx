import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HouseIcon from '@mui/icons-material/House';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Link } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import { Product } from './utils/types';
import Numeral from 'utils/Numeral';
import IconDelivery from 'icons/DeliveryIcon';
import IconCart from 'icons/CartIcon';

const columnHelper = getColumnHelper<Product>();

const HEAD_CELLS: HeadCell<Product> = {
  index: 'ID',
  id: 'ID',
  imageUrl: 'Ảnh',
  proudctCode: 'Mã sản phẩm',
  proudctName: 'Tên sản phẩm',
  barCode: 'Mã vạch',
  entryPrice: 'Giá nhập',
  costPrice: 'Giá vốn',
  salePrice: 'Giá bán',
  inventory: 'Tồn',
  totalInventory: 'Tổng tồn',
  spaPrice: 'Giá spa',
  delivery: 'Đang giao hàng',
  instock: 'Tồn trong kho',
  temporarilyHold: 'Tạm giữ',
  sellNumber: 'Có thể bán',
  coming: 'Đang về',
  booking: 'Đặt trước',
  status: 'Trạng thái bán',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const dialog = useDialog();
  const boxSX = {
    color: 'rgb(0, 123, 255)',
    fontWeight: 500,
    '&:hover': {
      color: 'rgb(0, 123, 255)',
    },
  };
  const columns: ProColumn<Product> = useMemo(() => {
    return [
      Selection<any>(),
      columnHelper.accessor('id', {
        id: 'id',
        size: 60,
        enableSorting: false,
        header: () => HEAD_CELLS.id,
        cell: (context) => {
          const { id, billType,sequenceId } = context.row.original;
          return (
            <Box>
              <Link
                href={`/inventory/bill/detail/${id}/${billType}`}
                sx={boxSX}
              >
                {sequenceId}
              </Link>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('imageUrl', {
        id: 'imageUrl',
        size: 60,
        enableSorting: false,
        header: () => HEAD_CELLS.imageUrl,
        cell: (context) => <AddCircleIcon color="success" />,
        meta: {
          title: HEAD_CELLS.imageUrl,
        },
      }),
      columnHelper.accessor('barCode', {
        id: 'barCode',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.barCode,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.barCode,
        },
      }),
      columnHelper.accessor('proudctCode', {
        id: 'proudctCode',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.proudctCode,
        cell: (context) => (
          <Typography variant="subtitle2">
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.proudctCode,
        },
      }),
      columnHelper.accessor('proudctName', {
        id: 'proudctName',
        size: 250,
        header: () => HEAD_CELLS.proudctName,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Link
              href={`/products/detail?id=${id}`}
              underline="hover"
              sx={{ color: '#007bff', fontWeight: '500' }}
            >
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.proudctName,
        },
      }),

      columnHelper.accessor('costPrice', {
        id: 'costPrice',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.costPrice,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.costPrice,
        },
      }),
      columnHelper.accessor('salePrice', {
        id: 'salePrice',
        size: 100,
        header: () => HEAD_CELLS.salePrice,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.salePrice,
        },
      }),
      columnHelper.accessor('spaPrice', {
        id: 'spaPrice',
        size: 100,
        header: () => HEAD_CELLS.spaPrice,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.spaPrice,
        },
      }),
      columnHelper.accessor('entryPrice', {
        id: 'entryPrice',
        size: 100,
        header: () => HEAD_CELLS.entryPrice,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.entryPrice,
        },
      }),

      columnHelper.accessor('inventory', {
        id: 'inventory',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.inventory,
        cell: (context) => context.getValue(),
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

      columnHelper.accessor('delivery', {
        id: 'delivery',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Đang giao hàng">
            <LocalShippingIcon color="primary" />
            {/* <i className="fa-light fa-truck-clock"></i> */}
            
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.delivery,
        },
      }),
      // columnHelper.accessor('instock', {
      //   id: 'instock',
      //   size: 100,
      //   enableSorting: false,
      //   header: () => (
      //     <Tooltip title="Tồn trong kho">
      //       <HouseIcon />
      //     </Tooltip>
      //   ),
      //   cell: (context) => context.getValue(),
      //   meta: {
      //     title: HEAD_CELLS.instock,
      //   },
      // }),
      columnHelper.accessor('temporarilyHold', {
        id: 'temporarilyHold',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Tạm giữ">
            <InventoryIcon color="warning" />
          </Tooltip>
        ),
        cell: (context) =>  context.getValue(),
        meta: {
          title: HEAD_CELLS.temporarilyHold,
        },
      }),
      columnHelper.accessor('sellNumber', {
        id: 'sellNumber',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Có thể bán">
            <CheckBoxIcon color="success" />
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.sellNumber,
        },
      }),
      columnHelper.accessor('coming', {
        id: 'coming',
        size: 100,
        enableSorting: false,
        header: () => (
            <IconDelivery tooltipName="Đang về"/>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.coming,
        },
      }),
        columnHelper.accessor('booking', {
        id: 'booking',
        size: 100,
        enableSorting: false,
        header: () => (
            <IconCart tooltipName="Đặt trước" />
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.booking,
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 100,
        enableSorting: false,
        header: () => 'Trạng thái bán',
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.status,
        },
      }),

      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const handleDeleteRow = () => {
            dialog({
              // headline: 'Xác nhận xóa?',
              // supportingText: (
              //   <Fragment>
              //     Bạn có chắc chắn muốn xóa:{' '}
              //     <strong>{context.row.original.name}</strong>
              //   </Fragment>
              headline: 'Đang phát triển',
              supportingText: (
                <Fragment>
                 Đang phát triển
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
                  label: 'Sửa',
                  value: 1,
                  actionType: 'edit',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Sửa giá',
                  value: 2,
                  actionType: 'edit',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Tạo giá vốn mới',
                  value: 3,
                  actionType: 'edit',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Chuyển mã',
                  value: 4,
                  actionType: 'edit',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Sửa giá vốn nhanh',
                  value: 5,
                  actionType: 'edit',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Xóa',
                  value: 6,
                  actionType: 'delete',
                  color: 'error.main',
                  onSelect: handleDeleteRow,
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
