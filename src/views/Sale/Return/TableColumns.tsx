import EditIcon from '@mui/icons-material/Edit';
// import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SouthIcon from '@mui/icons-material/South';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, Grid, IconButton, TableRow } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DateTime from 'utils/DateTime';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
// import filter from 'lodash.filter';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import filter from 'lodash.filter';
import ProSubTableCell from 'components/ProTable/ProSubTableCell';
import Numeral from 'utils/Numeral';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  date: 'Ngày',
  idBill: 'ID',
  customer: 'Khách hàng',
  product: 'Sản phẩm',
  price: 'Giá',
  amount: 'SL',
  // vat: 'VAT',
  discount: 'Chiết khấu',
  return: 'Trả lại',
  totalPrice: 'Tổng tiền',
  returnAmount: "Phí",
  payNote: 'Ghi chú',
  actions: 'Hành động',
};

interface Props {
  pageIndex: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
  handleOpenEditNoteDialog: (value: any) => void;
}

const useTableColumns = (props: Props) => {
  const { handleOpenDialog, handleOpenEditNoteDialog } = props;
  const dialog = useDialog();
  const navigate = useNavigate();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('creationTime', {
        id: 'creationTime',
        size: 150,
        header: () => HEAD_CELLS.date,
        cell: (context) => {
          const { creationTime, employeeSell, creatorName } = context.row.original
          return (
            <>
              <Typography>
                {DateTime.Format(creationTime, 'DD-MM-YYYY HH:mm')}
              </Typography>
              <Typography>
                {employeeSell}
              </Typography>
              <Typography>
                {creatorName}
              </Typography>
            </>
          )
        },
        meta: {
          title: HEAD_CELLS.date,
          align: 'center',
        },
      }),
      columnHelper.accessor('idBill', {
        id: 'idBill',
        size: 100,
        header: () => HEAD_CELLS.idBill,
        cell: (context) => (
          <Typography

            sx={{ color: '#007bff', cursor: 'pointer' }}
            onClick={() => handleOpenDialog(context)}
          >
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.idBill,
          align: 'center',
        },
      }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.customer,
        cell: (context) => {
          const { customerName, accountCode, phoneNumber } = context.row.original

          return (
            <>
              <Typography>
                {accountCode}
              </Typography>
              <Typography>
                {customerName}
              </Typography>
              <Typography>
                {phoneNumber}
              </Typography>
            </>
          )
        },
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
        meta: {
          title: HEAD_CELLS.customer,
          align: 'center',
        },
      }),
      columnHelper.accessor('products', {
        id: 'products',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.products?.length;

          return context.row.original.products.map(
            (product: any, index: any) => {
              return (
                <TableRow key={product.id}>
                  <ProSubTableCell
                    id={`${product.id}-${context.row.index}-${index}`}
                    key={context.cell.id}
                    fixed={fixed}
                    align={align}
                    selected={selected}
                    offset={offset}
                    subRowBorder={true}
                    subRowBorderBottom={lastCheck === index + 1 ? true : false}
                    sx={{
                      width: context.cell.column.getSize() * 2,
                      minHeight: 50,
                      padding: '6px 16px',
                    }}
                  >
                    {product.name}
                  </ProSubTableCell>
                </TableRow>
              );
            }
          );
        },
        // cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
          align: 'center'
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        header: () => HEAD_CELLS.price,
        // cell: (context) => context.getValue(),
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.products?.length;

          return context.row.original.products?.map(
            (product: any, index: any) => {
              return (
                <TableRow key={product.id}>
                  <ProSubTableCell
                    id={`${product.id}-${context.row.index}-${index}`}
                    key={context.cell.id}
                    fixed={fixed}
                    align={align}
                    selected={selected}
                    offset={offset}
                    subRowBorder={true}
                    subRowBorderBottom={lastCheck === index + 1 ? true : false}
                    sx={{
                      width: context.cell.column.getSize() * 2,
                      minHeight: 50,
                      padding: '6px 16px',
                    }}
                  >
                    {Numeral.price(product.price)}
                  </ProSubTableCell>
                </TableRow>
              );
            }
          );
        },
        meta: {
          title: HEAD_CELLS.price,
          align: 'center'
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.amount,
        // cell: (context) => context.getValue(),
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.products?.length;

          return context.row.original.products?.map(
            (product: any, index: any) => {
              return (
                <TableRow key={product.id}>
                  <ProSubTableCell
                    id={`${product.id}-${context.row.index}-${index}`}
                    key={context.cell.id}
                    fixed={fixed}
                    align={align}
                    selected={selected}
                    offset={offset}
                    subRowBorder={true}
                    subRowBorderBottom={lastCheck === index + 1 ? true : false}
                    sx={{
                      width: context.cell.column.getSize() * 2,
                      minHeight: 50,
                      padding: '6px 16px',
                    }}
                  >
                    {product.quantity}
                  </ProSubTableCell>
                </TableRow>
              );
            }
          );
        },
        meta: {
          title: HEAD_CELLS.amount,
          align: 'center'
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];
          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              item?.original?.products?.map((_item: any) => {
                const Total = _item.quantity;
                arrayTotal.push(Total);
              });
            });
          }
          let totalQuantity: number = 0;
          for (var i in arrayTotal) {
            totalQuantity += arrayTotal[i];
          }
          return <Typography variant="subtitle2">{Numeral.price(totalQuantity)}</Typography>

        }
      }),
      columnHelper.accessor('discountValue', {
        id: 'discountValue',
        size: 100,
        enableSorting: false,
        header: () => "Chiết khấu",
        // header: () => (
        //   <Tooltip title="Chiết khấu">
        //     <SouthIcon color="error" />
        //   </Tooltip>
        // ),
        cell: (context) => context.getValue(),
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];
          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              const Total = item.original.discountValue;
              arrayTotal.push(Total);
            });
          }
          let totalDiscountValue: number = 0;
          for (var i in arrayTotal) {
            totalDiscountValue += arrayTotal[i];
          }

          return <Typography variant="subtitle2">{totalDiscountValue}</Typography>

        },
        meta: {
          title: HEAD_CELLS.discount,
          align: 'center'
        },
      }),
      columnHelper.accessor('return', {
        id: 'return',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.return,
        cell: (context) => {
          const { cash, banking, totalAmount, } = context.row.original

          return (
            <Grid container justifyContent={'flex-end'}>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                <MoneyOutlinedIcon sx={{ marginRight: 1 }} />
                {Numeral.price(cash)}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: 'primary.main', marginBottom: 1 }}
              >
                Còn: {Numeral.price(totalAmount - cash)}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  fontSize: '14px',
                  marginBottom: 1,
                  borderBottom: '1px solid #ccc',
                }}
              >
                <AccountBalanceIcon sx={{ marginRight: 1 }} />
                {Numeral.price(banking)}
              </Typography>

              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                Còn:
              </Typography>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                {Numeral.price(totalAmount - cash - banking)}
              </Typography>
            </Grid>
          )
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal1: number[] = [];
          const arrayTotal2: number[] = [];
          const arrayTotal3: number[] = [];
          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              const cash = item.original.cash;
              const banking = item.original.banking;
              const totalAmount = item.original.totalAmount;
              arrayTotal1.push(cash);
              arrayTotal2.push(banking);
              arrayTotal3.push(totalAmount);
            });
          }
          const total1: number = arrayTotal1.reduce((acc, curr) => acc + curr, 0);
          const total2: number = arrayTotal2.reduce((acc, curr) => acc + curr, 0);
          const total3: number = arrayTotal3.reduce((acc, curr) => acc + curr, 0);
          return (
            <Grid container justifyContent={'flex-end'}>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                <MoneyOutlinedIcon sx={{ marginRight: 1 }} />
                {Numeral.price(total1)}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: 'primary.main', marginBottom: 1 }}
              >
                Còn: {Numeral.price(total3 - total1)}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  fontSize: '14px',
                  marginBottom: 1,
                  borderBottom: '1px solid #ccc',
                }}
              >
                <AccountBalanceIcon sx={{ marginRight: 1 }} />
                {Numeral.price(total2)}
              </Typography>

              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                Còn:
              </Typography>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                {Numeral.price(total3 - total2 - total1)}
              </Typography>
            </Grid>
          )

        },
        meta: {
          title: HEAD_CELLS.return,
          align: 'center'
        },
      }),
      columnHelper.accessor('returnAmount', {
        id: 'returnAmount',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.returnAmount,
        cell: (context) => Numeral.price(context.getValue()),
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];
          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              const Total = item.original.returnAmount;
              arrayTotal.push(Total);
            });
          }
          let totalReturnAmount: number = 0;
          for (var i in arrayTotal) {
            totalReturnAmount += arrayTotal[i];
          }
          return <Typography>{Numeral.price(totalReturnAmount)}</Typography>

        },
        meta: {
          title: HEAD_CELLS.returnAmount,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalAmount', {
        id: 'totalAmount',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalPrice,
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];
          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              const Total = item.original.totalAmount;
              arrayTotal.push(Total);
            });
          }
          let totalAmountValue: number = 0;
          for (var i in arrayTotal) {
            totalAmountValue += arrayTotal[i];
          }
          return <Typography>{Numeral.price(totalAmountValue)}</Typography>
        },

        cell: (context) => (
          <Typography sx={{ fontWeight: 'bold' }}>
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalPrice,
          align: 'center'
        },
      }),

      columnHelper.accessor('payNote', {
        id: 'payNote',
        size: 100,
        enableSorting: false,
        header: () => "Ghi chú",
        // header: () => (
        //   <Tooltip title="Ghi chú">
        //     <NoteAltIcon />
        //   </Tooltip>
        // ),
        cell: (context) => (
          <Box>
            {context.getValue()}
            <IconButton onClick={() => handleOpenEditNoteDialog(context)}>
              <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
            </IconButton>
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.payNote,
          align: 'center'
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
              headline: 'Xác nhận xóa?',
              supportingText: (
                <Fragment>
                  Bạn có chắc chắn muốn xóa:{' '}
                  <strong>{context.row.original.name}</strong>
                </Fragment>
              ),
              onConfirm: async () => { },
            });
          };
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'In phiếu',
                  value: 1,
                  actionType: 'print',
                },
                {
                  label: 'In thẻ kho',
                  value: 2,
                  actionType: 'print',
                },
                {
                  label: 'Sửa phiếu trả hàng',
                  value: 3,
                  actionType: 'edit',
                  onSelect: () => {
                    navigate('/sales/return/edit/' + context?.row?.original?.id)
                  },
                },
                {
                  label: 'Xóa phiếu',
                  value: 4,
                  actionType: 'delete',
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
  }, [handleOpenDialog, dialog, handleOpenEditNoteDialog, navigate]);

  return { columns };
};

export default useTableColumns;
