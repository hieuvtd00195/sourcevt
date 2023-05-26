import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Currency from 'utils/Currency';
import { IImportExport } from './utils/types';

const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  index: 'ID',
  idAndDay: 'Ngày',
  warehouse: 'Cửa hàng',
  productDadCode: 'Mã SP cha',
  productDadName: 'Tên SP cha',
  productCode: ' Mã sản phẩm',
  product: 'Sản phẩm',
  quantity: 'SL',
  dvt: 'ĐVT',
  inventory: 'Tồn',
  price: 'Giá',
  costPrice: 'Giá vốn',
  money: 'Tiền',
  totalMoney: 'Tổng tiền',
  icon: 'Chiết khấu',
  quantitySection: 'Phần số lượng',
  creator: 'Người tạo',
  note: 'Ghi chú',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const navigate = useNavigate();
  const columns: ProColumn<IImportExport> = useMemo(() => {
    return [
      columnHelper.accessor('id', {
        id: 'id',
        size: 50,
        header: () => HEAD_CELLS.index,
        cell: (context) => {
          return (
            <Link href="/inventory?value=filter1" color="#077BFF">
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.index,
        },
      }),
      columnHelper.accessor('idAndDay', {
        id: 'idAndDay',
        size: 50,
        header: () => HEAD_CELLS.idAndDay,
        cell: (context) => (
          <Typography variant="body2">{context.getValue().day}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.idAndDay,
        },
      }),
      columnHelper.accessor('warehouse', {
        id: 'warehouse',
        size: 200,
        header: () => HEAD_CELLS.warehouse,
        cell: (context) => (
          <Box>
            <Typography variant="body1">{context.getValue().name}</Typography>
            <Typography variant="body1" sx={{ color: 'red' }}>
              {context.getValue().type}
            </Typography>
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.warehouse,
        },
      }),
      columnHelper.accessor('inventory', {
        id: 'inventory',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.inventory,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.inventory,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.price,
        cell: (context) => Currency.FormatVND(context.getValue()),
        meta: {
          title: HEAD_CELLS.price,
        },
      }),
      columnHelper.accessor('money', {
        id: 'money',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.money,
        cell: (context) => Currency.FormatVND(context.getValue()),
        meta: {
          title: HEAD_CELLS.money,
        },
      }),
      columnHelper.accessor('totalMoney', {
        id: 'totalMoney',
        size: 100,
        header: () => HEAD_CELLS.totalMoney,
        cell: (context) => (
          <Typography variant="body1" sx={{ color: 'red' }}>
            {Currency.FormatVND(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalMoney,
        },
      }),
      columnHelper.accessor('icon', {
        id: 'icon',
        size: 50,
        header: () => HEAD_CELLS.icon,
        cell: (context) => (
          <Typography variant="subtitle2">
            {Currency.FormatVND(1111111)}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.icon,
        },
      }),
      columnHelper.accessor('icon', {
        id: 'icon',
        size: 50,
        header: () => HEAD_CELLS.quantitySection,
        cell: (context) => (
          <Typography variant="subtitle2">
            {/* nếu là phiếu nhập –màu xanh, phiếu xuất –màu đỏ */}
            {/* {Currency.FormatVND(1111111)} */}
            Phần số lượng
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.quantitySection,
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
                  value: 1,
                  actionType: 'edit',
                  onSelect: () => navigate('/inventory/imex/edit'),
                },
                {
                  label: 'Xóa',
                  value: 6,
                  actionType: 'delete',
                },
              ]}
            >
              <ActionIconButton actionType="more" />
            </ProMenu>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [navigate]);

  return { columns };
};

export default useTableColumns;
