import ImageIcon from '@mui/icons-material/Image';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SouthIcon from '@mui/icons-material/South';
import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
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
  price: 'Đơn giá',
  price1: 'BG',
  amount: 'SL',
  payment: 'Thành Tiền',
  discount: 'Chiết khấu',
  total: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
}

const useTableColumns = (props: Props) => {
  const { handleOpenDialog } = props;
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('image', {
        id: 'image',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Ảnh sản phẩm">
            <ImageIcon />
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.image,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 30,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('unit', {
        id: 'unit',
        size: 100,
        header: () => HEAD_CELLS.unit,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.unit,
          colSpan: () => 2,
        },
        footer: (context) => (
          <>
            <Typography variant="subtitle2">Tổng</Typography>
            <Typography variant="subtitle2">Tổng phải trả</Typography>
          </>
        ),
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        header: () => HEAD_CELLS.price,
        cell: (context) => <TextField id="outlined-basic" variant="outlined" />,
        meta: {
          title: HEAD_CELLS.price,
        },
        footer: (context) => (
          <>
            <Typography variant="subtitle2">1</Typography>
            <Typography variant="subtitle2">1</Typography>
          </>
        ),
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        size: 100,
        header: () => HEAD_CELLS.amount,
        cell: (context) => <TextField id="outlined-basic" variant="outlined" />,
        meta: {
          title: HEAD_CELLS.amount,
        },
        footer: (context) => (
          <>
            <Typography variant="subtitle2">1</Typography>
            <Typography variant="subtitle2">1</Typography>
          </>
        ),
      }),
      columnHelper.accessor('price1', {
        id: 'price1',
        size: 100,
        header: () => HEAD_CELLS.price1,
        cell: (context) => (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            placeholder="Bảng giá"
            value={null}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        ),
        meta: {
          title: HEAD_CELLS.price1,
        },
      }),
      columnHelper.accessor('payment', {
        id: 'payment',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.payment,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.payment,
        },
        footer: (context) => (
          <>
            <Typography variant="subtitle2">1</Typography>
            <Typography variant="subtitle2">1</Typography>
          </>
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
        footer: (context) => (
          <>
            <Typography variant="subtitle2">1</Typography>
            <Typography variant="subtitle2">1</Typography>
          </>
        ),
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
          <>
            <Typography variant="subtitle2">1</Typography>
            <Typography variant="subtitle2">1</Typography>
          </>
        ),
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
          const handleClickShowPopup = () => {
            handleOpenDialog(context);
          };
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Bảo hiểm, BHMR, Ghi chú',
                  value: 1,
                  actionType: 'add',
                  onSelect: handleClickShowPopup,
                },

                {
                  label: 'Xóa hóa đơn',
                  value: 3,
                  actionType: 'delete',
                  color: 'error.main',
                  onSelect: handleDeleteRow,
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
  }, [dialog, handleOpenDialog]);

  return { columns };
};

export default useTableColumns;
