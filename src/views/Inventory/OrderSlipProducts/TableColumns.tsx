import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, IconButton, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  saleOrderLineCode: 'ID',
  productName: 'Tên sản phẩm',
  suplierText: 'Tên NCC',
  invoiceNumber: 'Số hóa đơn',
  rate: 'Tỷ giá',
  requestPrice: 'Giá yêu cầu',
  suggestedPrice: 'Giá đề xuất',
  totalYuan: 'TT tệ',
  totalPrice: 'Tổng tiền',
  quantity: 'SL',
  note: 'Mô tả',
  actions: 'Hành động',
};

interface Props {
  pageIndex: number;
  pageSize: number;
  handleEditPrice: (id: string, value: string) => void;
}

const useTableColumns = (props: Props) => {
  const { pageIndex, pageSize, handleEditPrice } = props;
  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('saleOrderLineCode', {
        id: 'saleOrderLineCode',
        size: 80,
        enableSorting: false,
        header: () => 'ID',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.saleOrderLineCode,
          align: 'center',
        },
      }),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 250,
        enableSorting: false,
        header: () => 'Tên sản phẩm',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.productName,
          align: 'center',
        },
      }),
      columnHelper.accessor('suplierText', {
        id: 'suplierText',
        size: 200,
        enableSorting: false,
        header: () => 'Tên NCC',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.suplierText,
          align: 'center',
        },
      }),
      columnHelper.accessor('invoiceNumber', {
        id: 'invoiceNumber',
        size: 180,
        enableSorting: false,
        header: () => (
          <Typography variant="subtitle2" textAlign={'center'}>
            Số hóa đơn
          </Typography>
        ),
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.invoiceNumber,
          align: 'center',
        },
      }),

      columnHelper.accessor('rate', {
        id: 'rate',
        size: 120,
        enableSorting: false,
        header: () => 'Tỷ giá',
        cell: (context) => (
          <Typography variant="subtitle2">
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.rate,
          align: 'center',
        },
      }),
      columnHelper.accessor('requestPrice', {
        id: 'requestPrice',
        size: 120,
        enableSorting: false,
        header: () => 'Giá yêu cầu',
        cell: (context) => (
          <Typography variant="subtitle2">
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.requestPrice,
          align: 'center',
        },
      }),

      columnHelper.accessor('suggestedPrice', {
        id: 'suggestedPrice',
        size: 200,
        enableSorting: false,
        header: () => 'Giá đề xuất',
        cell: (context) => {
          const id = context?.row?.original?.id;
          const value = context.getValue();
          return (
            <Grid container>
              <Grid item xs={10}>
                <Typography variant="subtitle2">
                  {Numeral.price(context.getValue())}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  sx={{ p: 1 }}
                  onClick={() => handleEditPrice(id, value)}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        },
        meta: {
          title: HEAD_CELLS.suggestedPrice,
          align: 'center',
        },
      }),

      columnHelper.accessor('totalYuan', {
        id: 'totalYuan',
        size: 150,
        enableSorting: false,
        header: () => 'TT tệ',
        cell: (context) => (
          <Typography variant="subtitle2">
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalYuan,
          align: 'center',
        },
      }),

      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        size: 150,
        enableSorting: false,
        header: () => 'Tổng tiền',
        cell: (context) => (
          <Typography variant="subtitle2">
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 150,
        enableSorting: false,
        header: () => 'SL',
        cell: (context) => (
          <Typography variant="subtitle2">
            {Numeral.price(context?.getValue()?.importQuantity)} /{' '}
            {Numeral.price(context?.getValue()?.requestQuantity)}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.quantity,
          align: 'center',
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 200,
        enableSorting: false,
        header: () => 'Mô tả',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.note,
          align: 'center',
        },
      }),
    ];
  }, [pageIndex, pageSize, dialog]);

  return { columns };
};

const EditBox = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`;

export default useTableColumns;
