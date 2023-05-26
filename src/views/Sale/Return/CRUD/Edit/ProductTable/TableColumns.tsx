import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SouthIcon from '@mui/icons-material/South';
import {
  Box,
  Checkbox,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  image: 'Ảnh sản phẩm',
  product: 'Sản phẩm',
  unit: 'ĐVT',
  price: 'Giá',
  amount: 'SL',
  payment: 'Thành Tiền',
  discount: 'Chiết khấu',
  total: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleDeleteSelected: () => void;
}

const useTableColumns = (props: Props) => {
  const { handleDeleteSelected } = props;
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.display({
        id: 'selection',
        size: 60,
        maxSize: 60,
        minSize: 60,
        header: (info) => (
          <>
            <Checkbox
              checked={info.table.getIsAllRowsSelected()}
              indeterminate={info.table.getIsSomeRowsSelected()}
              onChange={info.table.getToggleAllRowsSelectedHandler()}
            />
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Xóa hóa đơn',
                  value: 3,
                  actionType: 'delete',
                  onSelect: handleDeleteSelected,
                },
              ]}
            >
              <ActionIconButton actionType="arrowDown" />
            </ProMenu>
          </>
        ),
        cell: ({ row }) => (
          <Box>
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </Box>
        ),
        meta: {
          title: 'Chọn tất cả',
          // colSpan: () => null,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 30,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
        },
      }),
      columnHelper.accessor('unit', {
        id: 'unit',
        size: 100,
        header: () => HEAD_CELLS.unit,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.unit,
        },
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
      }),

      columnHelper.accessor('amount', {
        id: 'amount',
        size: 100,
        header: () => HEAD_CELLS.amount,
        cell: (context) => <TextField id="outlined-basic" variant="outlined" />,
        meta: {
          title: HEAD_CELLS.amount,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        header: () => HEAD_CELLS.price,
        cell: (context) => <TextField id="outlined-basic" variant="outlined" />,
        meta: {
          title: HEAD_CELLS.price,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.total,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.total,
        },
        footer: (context) => (
          <Typography sx={{ color: 'primary.main' }} variant="subtitle2">
            60.000
          </Typography>
        ),
      }),
      columnHelper.accessor('discount', {
        id: 'discount',
        size: 200,
        enableSorting: false,
        header: () => (
          <Tooltip title="Chiết khấu">
            <SouthIcon color="error" />
          </Tooltip>
        ),
        cell: (context) => (
          <Grid container sx={{ marginBottom: 1, marginTop: 1 }}>
            <Grid item xs={3}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={1}
                label="Age"
                onChange={() => {}}
              >
                <MenuItem value={1}>%</MenuItem>
                <MenuItem value={2}>VNĐ</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={9}>
              <TextField id="outlined-basic" variant="outlined" />
            </Grid>
          </Grid>
        ),
        meta: {
          title: HEAD_CELLS.discount,
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
              headline: 'Xóa sản phẩm',
              supportingText: (
                <Fragment>Bạn có chắc chắn muốn xóa sản phẩm này?</Fragment>
              ),
              onConfirm: async () => {},
            });
          };
          return (
            <ActionIconButton actionType="delete" onClick={handleDeleteRow} />
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [dialog]);

  return { columns };
};

export default useTableColumns;
