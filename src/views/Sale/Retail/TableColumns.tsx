import EditIcon from '@mui/icons-material/Edit';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SouthIcon from '@mui/icons-material/South';
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TableRow,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IRetail } from 'types/retail';
import filter from 'lodash.filter';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ProTableCell from 'components/ProTable/ProTableCell';
import ProSubTableCell from 'components/ProTable/ProSubTableCell';
import Numeral from 'utils/Numeral';
interface TableCreateProducts {
  [key: string]: any;
}
const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  creatorText: 'Người tạo',
  billCustomerCode: 'ID',
  storeText: 'Cửa hàng',
  customerText: 'Khách hàng',
  productName: 'Sản phẩm',
  billCustomerPayStatusText: 'Trạng thái',
  product: 'Sản phẩm',
  price: 'Giá',
  quantity: 'SL',
  unit: 'ĐVT',
  vatValue: 'VAT',
  discountValue: 'Chiết khấu',
  amountCustomerPay: 'Tổng tiền',
  thanhtoan: 'Thanh toán',
  payNote: 'Ghi chú',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
  handleOpenEditNoteDialog: (value: any) => void;
  onDelete: (rowIndex: number, rowId: string) => () => Promise<void>;
}

const useTableColumns = (props: Props) => {
  const { handleOpenDialog, handleOpenEditNoteDialog,onDelete } = props;
  const dialog = useDialog();
  const navigate = useNavigate();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.display({
        id: 'selection',
        size: 60,
        maxSize: 60,
        minSize: 60,
        header: (info) => (
          <Checkbox
            checked={info.table.getIsAllRowsSelected()}
            indeterminate={info.table.getIsSomeRowsSelected()}
            onChange={info.table.getToggleAllRowsSelectedHandler()}
          />
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
        },
      }),
      columnHelper.accessor('creatorText', {
        id: 'creatorText',
        size: 100,
        header: () => HEAD_CELLS.creatorText,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.creatorText,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              { creatorText: context.getValue() }
            );
            const resultFilter = filter(
              result.map(
                (row) => row.billCustomerId === result[0].billCustomerId
              )
            );

            if (
              context.row.original.billCustomerId === result[0].billCustomerId
            ) {
              return resultFilter.length;
            }

            return 1;
            // if (context.row.original.billCustomerProducts === result[0]?.billCustomerProducts) {
            //   return result.length;
            // }

            // return null;
          },
          colSpan: () => 7,
        },
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
      }),
      columnHelper.accessor('billCustomerCode', {
        id: 'billCustomerCode',
        size: 100,
        header: () => HEAD_CELLS.billCustomerCode,
        cell: (context) => (
          <Typography
            variant="subtitle2"
            sx={{ color: '#007bff', cursor: 'pointer' }}
            onClick={() => handleOpenDialog(context)}
          >
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.billCustomerCode,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('storeText', {
        id: 'storeText',
        size: 100,
        header: () => HEAD_CELLS.storeText,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.storeText,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('customerText', {
        id: 'customerText',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.customerText,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.customerText,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('billCustomerPayStatusText', {
        id: 'billCustomerPayStatusText',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.billCustomerPayStatusText,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.billCustomerPayStatusText,
          colSpan: () => null,
        },
      }),

      columnHelper.accessor('productName', {
        id: 'productName',
        size: 200,
        minSize: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.productName,
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.billCustomerProducts.length;

          return context.row.original.billCustomerProducts.map(
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
                    {product.productName}
                  </ProSubTableCell>
                </TableRow>
              );
            }
          );
        },
        meta: {
          title: HEAD_CELLS.productName,
          colSpan: () => null,
        },
      }),

      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.price,
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.billCustomerProducts.length;

          return context.row.original.billCustomerProducts.map(
            (product: any, index: any) => {
              const element = window.document.getElementById(
                `${product.id}-${context.row.index}-${index}`
              );

              return (
                <TableRow key={product.id}>
                  <ProSubTableCell
                    key={context.cell.id}
                    fixed={fixed}
                    align={align}
                    selected={selected}
                    offset={offset}
                    subRowBorder={true}
                    subRowBorderBottom={lastCheck === index + 1 ? true : false}
                    sx={{
                      width: context.cell.column.getSize() * 2,
                      height: element ? element.offsetHeight : 'auto',
                      padding: '6px 16px',
                    }}
                  >
                    {product.price}
                  </ProSubTableCell>
                </TableRow>
              );
            }
          );
        },
        meta: {
          title: HEAD_CELLS.price,
          // colSpan: () => 8,
          colSpan: () => null,
        },
      }),

      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.billCustomerProducts.length;

          return context.row.original.billCustomerProducts.map(
            (product: any, index: any) => {
              const element = window.document.getElementById(
                `${product.id}-${context.row.index}-${index}`
              );

              return (
                <TableRow key={product.id}>
                  <ProSubTableCell
                    key={context.cell.id}
                    fixed={fixed}
                    align={align}
                    selected={selected}
                    offset={offset}
                    subRowBorder={true}
                    subRowBorderBottom={lastCheck === index + 1 ? true : false}
                    sx={{
                      width: context.cell.column.getSize() * 2,
                      height: element ? element?.offsetHeight : 'auto',
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
          title: HEAD_CELLS.quantity,
          colSpan: () => 1,
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];

          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              item.subRows.map((sub: any) => {
                const Total = sub.original.quantity;
                arrayTotal.push(Total);
              });
            });
          }
          let totalDebtAmount: number = 0;
          for (var i in arrayTotal) {
            totalDebtAmount += arrayTotal[i];
          }
          return (
            <Typography
              fontWeight="bold"
              sx={{ color: '#000000', textAlign: 'center' }}
            >
              {Numeral.price(totalDebtAmount)}
            </Typography>
          );
        },
      }),
      columnHelper.accessor('unit', {
        id: 'unit',
        size: 100,
        header: () => HEAD_CELLS.unit,
        cell: (context) => {
          const offset = context.cell.column.getStart();
          const fixed = context.cell.column.getIsPinned();
          const align = context.cell.column.columnDef.meta?.align;
          const selected = context.row.getIsSelected();
          const lastCheck = context.row.original?.billCustomerProducts.length;

          return context.row.original.billCustomerProducts.map(
            (product: any, index: any) => {
              const element = window.document.getElementById(
                `${product.id}-${context.row.index}-${index}`
              );

              return (
                <TableRow key={product.id}>
                  <ProSubTableCell
                    key={context.cell.id}
                    fixed={fixed}
                    align={align}
                    selected={selected}
                    offset={offset}
                    subRowBorder={true}
                    subRowBorderBottom={lastCheck === index + 1 ? true : false}
                    sx={{
                      width: context.cell.column.getSize() * 2,
                      height: element ? element.offsetHeight : 'auto',
                      padding: '6px 16px',
                    }}
                  >
                    {product.unit}
                  </ProSubTableCell>
                </TableRow>
              );
            }
          );
        },
        meta: {
          title: HEAD_CELLS.unit,
          colSpan: () => 1,
        },
      }),

      columnHelper.accessor('vatValue', {
        id: 'vatValue',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.vatValue,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.vatValue,
          colSpan: () => 1,
          // rowSpan: (context, rows) => {
          //   const result = filter(
          //     rows.map((row) => row.original),
          //     { vat: context.getValue() }
          //   );

          //   if (context.row.original.product === result[0]?.product) {
          //     return result.length;
          //   }

          //   return null;
          // },
          // colSpan: () => null,
        },
      }),
      columnHelper.accessor('discountValue', {
        id: 'discountValue',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Chiết khấu">
            <SouthIcon color="error" />
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.discountValue,
          colSpan: () => 1,
          // rowSpan: (context, rows) => {
          //   const result = filter(
          //     rows.map((row) => row.original),
          //     { discount: context.getValue() }
          //   );

          //   if (context.row.original.product === result[0]?.product) {
          //     return result.length;
          //   }

          //   return null;
          // },
          // colSpan: () => null,
        },
      }),
      columnHelper.accessor('amountCustomerPay', {
        id: 'amountCustomerPay',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.amountCustomerPay,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];

          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              const Total = item.original.amountCustomerPay
              arrayTotal.push(Total);
            });
          }
          let totalAmountAfterDiscount: number = 0;
          for (var i in arrayTotal) {
            totalAmountAfterDiscount += arrayTotal[i];
          }
          return (
            <Typography
              fontWeight="bold"
              sx={{ color: '#000000', textAlign: 'center' }}
            >
              {Numeral.price(totalAmountAfterDiscount)}
            </Typography>
          );
        },
        meta: {
          align: 'right',
          title: HEAD_CELLS.amountCustomerPay,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              {
                amountCustomerPay: context.getValue()
                  ? context.getValue()
                  : 0,
              }
            );
            const resultFilter = filter(
              result.map(
                (row) => row.billCustomerId === result[0].billCustomerId
              )
            );

            if (
              context.row.original.billCustomerId === result[0].billCustomerId
            ) {
              return resultFilter.length;
            }

            return 1;
          },
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('thanhtoan', {
        id: 'thanhtoan',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.thanhtoan,
        cell: (context) => {
          const {banking,cash} = context.row.original;

          return (
            <Grid container justifyContent={'flex-end'}>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                <MoneyOutlinedIcon /> &nbsp;
                {Numeral.price(Number(banking) + Number(cash))}
              </Typography>
              {/* <Typography
                variant="subtitle2"
                sx={{ color: 'primary.main', marginBottom: 1 }}
              >
                Nợ: {context.getValue()}
              </Typography>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                <PanToolAltIcon sx={{ transform: 'rotate(90deg)' }} />
                {context.getValue()}
              </Typography>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                <DomainIcon />
                {context.getValue()}
              </Typography> */}
            </Grid>
          )
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayCash: number[] = [];
          const arrayBank: number[] = [];
          const arrayTotal: number[] = [];

          if (getRows) {
            getRows.forEach((item: any, index: any) => {
              const TotalCash = item.original.cash;
              const TotalBank = item.original.banking;
              const Total = item.original.amountCustomerPay
              arrayTotal.push(Total);
              arrayBank.push(Number(TotalBank))
              arrayCash.push(Number(TotalCash));
            });
          }
          let totalAmountCash: number = 0;
          let totalAmountBank: number = 0;
          for (var i in arrayCash) {
            totalAmountCash += Number(arrayCash[i]);
          }
          for (var i in arrayBank) {
            totalAmountBank += Number(arrayBank[i]);
          }
          let totalAmountAfterDiscount: number = 0;
          for (var i in arrayTotal) {
            totalAmountAfterDiscount += Number(arrayTotal[i]);
          }
          const totalNo = totalAmountAfterDiscount - totalAmountCash
          const totalConNo = totalAmountAfterDiscount - totalAmountBank

          console.log(totalAmountCash,totalAmountBank);
          
          return (
            <Grid container justifyContent={'flex-end'}>
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                <MoneyOutlinedIcon sx={{ marginRight: 1 }} />
               {Numeral.price(totalAmountCash)}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: 'primary.main', marginBottom: 1 }}
              >
                Nợ: {Numeral.price(totalNo)}
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
                {Numeral.price(totalAmountBank)}
              </Typography>
  
              <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                Còn nợ: {Numeral.price(totalConNo)}
              </Typography>
              {/* <Typography
                sx={{ display: 'flex', fontSize: '14px', marginBottom: 1 }}
              >
                100
              </Typography> */}
            </Grid>
          )
        },

        meta: {
          title: HEAD_CELLS.thanhtoan,
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              // { thanhtoan: context.getValue() }
            );

            const resultFilter = filter(
              result.map(
                (row) => row.billCustomerId === result[0].billCustomerId
              )
            );

            if (
              context.row.original.billCustomerId === result[0].billCustomerId
            ) {
              return resultFilter.length;
            }
            return 1;
          },
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('payNote', {
        id: 'payNote',
        size: 100,
        enableSorting: false,
        header: () => (
          <Tooltip title="Ghi chú">
            <NoteAltIcon />
          </Tooltip>
        ),
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
          rowSpan: (context, rows) => {
            const result = filter(
              rows.map((row) => row.original),
              { payNote: context.getValue() }
            );

            // if (context.row.original.billCustomerProducts === result[0]?.billCustomerProducts) {
            //   return result.length;
            // }

            // return null;
            const resultFilter = filter(
              result.map(
                (row) => row.billCustomerId === result[0].billCustomerId
              )
            );

            if (
              context.row.original.billCustomerId === result[0].billCustomerId
            ) {
              return resultFilter.length;
            }
            return 1;
          },
          colSpan: () => 1,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const {id} = context.row.original
          const rowId = context.row.original.billCustomerId
          const rowIndex = context.row.index;
          const handleDeleteRow = () => {
            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: (
                <Fragment>
                  Bạn có chắc chắn muốn xóa đơn hàng :
                  <strong>{context.row.original.billCustomerCode}</strong>
                </Fragment>
              ),
              onConfirm: onDelete(rowIndex, rowId),
            });
          };
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'In hóa đơn',
                  value: 1,
                  actionType: 'print',
                },
                {
                  label: 'Cập nhật trạng thái',
                  value: 2,
                  actionType: 'edit',
                },
                {
                  label: 'Sửa hóa đơn',
                  value: 3,
                  actionType: 'edit',
                  onSelect: () => {
                    navigate(`/sales/retail/edit/${rowId}`);
                  },
                },
                {
                  label: 'Xem ảnh',
                  value: 3,
                  actionType: 'back',
                },
                {
                  label: 'Xóa hóa đơn',
                  value: 3,
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
