import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Grid, Stack, TextField, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo, useState } from 'react';
import Regexs from 'utils/Regexs';
import { IImportExport } from './utils/types';
import Validation from 'utils/Validation';
import ProFormDependency from 'components/ProForm/ProFormDependency';
import Numeral from 'utils/Numeral';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import filter from 'lodash.filter';
import _, { isEmpty } from 'lodash';
import styled from '@emotion/styled';
import ProFormTextInerField from 'components/ProTable/core/EditableCell/ProFormTextInerField';

const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  stt: 'STT',
  index: 'ID',
  productId: 'Mã sản phẩm',
  unitName: 'ĐVT',
  productStockQuantity: 'Tồn',
  product: 'Sản Phẩm',
  quantity: 'SL',
  IMEI: 'IMEI',
  price: 'Giá',
  total: 'Thành tiền',
  discountAmount: 'CK(VND)',
  totalPriceAfterDiscount: 'TT sau CK',
  khoiLuong: 'Khối lượng',
  quantityglo: 'SL-HD',
  actions: 'Hành động',
  totalAll: 'Tổng',
  note: 'Ghi chú',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  onUpdate: (rowIndex: number, rowId: string) => () => Promise<void>;
  onSetAllPrice: (type: string) => () => Promise<void>;
  setValue: any;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, onSetAllPrice, setValue } = props;
  const [checkNote, setCheckNote] = useState<number[]>([]);

  const columns: ProColumn<IImportExport> = useMemo(() => {
    return [
      //   Index<IImportExport>(pageNumber, pageSize),
      columnHelper.accessor('STT', {
        id: 'stt',
        size: 30,
        enableSorting: false,
        header: () => HEAD_CELLS.stt,
        cell: (context) => {
          const rowIndex = context.row.index;
          return <>{rowIndex + 1}</>;
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.stt,
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('product', {
        id: 'product',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => {
          const rowIndex = context.row.index;
          const { code, name, note } = context.row.original;
          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="body2">{code}</Typography>
              <Typography variant="body2">{name}</Typography>
              {/* {isEmpty(note) ? (
                checkNote.includes(rowIndex) ? (
                  <ProFormTextInerField
                    rowIndex={rowIndex}
                    columnId="note"
                    FormTextFieldProps={{}}
                    disabled={true}
                  />
                ) : null
              ) : (
                <ProFormTextInerField
                  rowIndex={rowIndex}
                  columnId="note"
                  FormTextFieldProps={{}}
                  disabled={true}
                  typeView={'detail'}
                />
              )} */}
            </Stack>
          );
        },

        meta: {
          title: HEAD_CELLS.product,
          colSpan: () => 1,
          editable: false,
        },
      }),
      columnHelper.accessor('unitName', {
        id: 'unitName',
        size: 50,
        header: () => HEAD_CELLS.unitName,
        enableSorting: false,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.unitName,
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('productStockQuantity', {
        id: 'productStockQuantity',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.productStockQuantity,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productStockQuantity,
          align: 'center',
          colSpan: () => 1,
        },
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 150,
        header: () => HEAD_CELLS.quantity,
        // header: (context) => {
        //   return (
        //     <>
        //       <ProFormTextField
        //         placeholder="SL"
        //         size="small"
        //         name="quantityInput"
        //         onChange={(e) => {
        //           setValue(`quantityInput`, e.target.value);
        //         }}
        //         InputProps={{
        //           inputComponent: PriceInput,
        //           // endAdornment: <ProInputAdornment>VND</ProInputAdornment>,
        //         }}
        //         disabled
        //       />
        //       <ActionIconButton
        //         disabled
        //         actionType="arrowDown"
        //         onClick={onSetAllPrice('quantityInput')}
        //       />
        //     </>
        //   );
        // },
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue<string>();
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceInput,
                },
              }}
            />
          );
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          let result = 0;
          const arraySLSP: string[] = [];
          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const rowIndex = index;
              const SLSP = `form.${rowIndex}.quantity`;
              arraySLSP.push(SLSP);
              result += Number(item.original.quantity);
            });
          }
          return (
            <ProFormDependency fields={arraySLSP}>
              {(values) => {
                let res = 0;
                for (const item in values) {
                  if (values[item]) {
                    res += parseFloat(values[item]);
                  }
                }
                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                    {res ? Numeral.price(res) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.quantity,
          editable: false,
          align: 'center',
          type: 'text',
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('IMEI', {
        id: 'IMEI',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.IMEI,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.IMEI,
          align: 'center',
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        header: () => HEAD_CELLS.price,
        enableSorting: false,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              render={() => Numeral.price(context.getValue())}
              FormTextFieldProps={{
                validate: Validation.string().default('0'),
                InputProps: {
                  inputComponent: PriceInput,
                },
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.price,
          editable: false,
          align: 'center',
          type: 'text',
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.total,
        cell: (context) => {
          const { quantity, price } = context.row.original;

          const rowIndex = context.row.index;
          const totalVnd = quantity * price;

          return (
            <Stack direction="column">
              <Typography>{Numeral.price(totalVnd)} </Typography>
            </Stack>
          );
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: string[] = [];
          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const rowIndex = index;
              const Total = `form.${rowIndex}.total`;
              const priceTT = `form.${rowIndex}.price`;
              const quantityTT = `form.${rowIndex}.quantity`;
              arrayTotal.push(Total, priceTT, quantityTT);
            });
          }
          return (
            <ProFormDependency fields={arrayTotal}>
              {(values) => {
                let res2 = 0;
                getRows.forEach((row, index) => {
                  const {
                    [`form.${index}.quantity`]: quantity,
                    [`form.${index}.price`]: price,
                  } = values;
                  const requestPriceAsNumber = parseFloat(price);
                  const requestQuantityAsNumber = parseFloat(quantity);

                  const totalVnd =
                    requestQuantityAsNumber * requestPriceAsNumber;
                  res2 += totalVnd;
                });

                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                    {res2 ? Numeral.price(res2) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.total,

          editable: true,
          type: 'text',
          align: 'center',
          colSpan: () => 1,
        },
      }),
      columnHelper.accessor('discountAmount', {
        id: 'discountAmount',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.discountAmount,
        cell: (context) => {
          const rowIndex = context.row.index;
          const SLSP = `form.${rowIndex}.quantity`;
          const GIATIEN = `form.${rowIndex}.price`;
          const ChietKhau = `form.${rowIndex}.discountAmount`;
          const TongtienTruoc = `form.${rowIndex}.totalPriceAfterDiscount`
          const TongtienSau = `form.${rowIndex}.totalPriceBeforeDiscount`
          const typeChietKhau = 'unitType';
          const checkType = 'audienceType';

          return (
            <ProFormDependency
              fields={[SLSP, GIATIEN, ChietKhau, typeChietKhau, checkType,TongtienTruoc,TongtienSau]}
            >
              {(values) => {
                const {
                  [SLSP]: quantity,
                  [GIATIEN]: price,
                  [ChietKhau]: discountRate,
                  [typeChietKhau]: unitType,
                  [checkType]: audienceType,
                  [TongtienTruoc]: totalPriceAfterDiscount,
                  [TongtienSau]: totalPriceBeforeDiscount
                } = values;
                const requestPriceAsNumber = parseFloat(price);
                const requestQuantityAsNumber = parseFloat(quantity);
                
                const totalVnd = quantity * price;
                const viewTotal = totalPriceBeforeDiscount - totalPriceAfterDiscount

                return (
                  <EditableCell
                    typeView={'detail'}
                    context={context}
                    render={() => Numeral.price(viewTotal)}
                    FormTextFieldProps={{
                      InputProps: {
                        inputComponent: PriceInput,
                      },
                    }}
                  />
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.discountAmount,
          editable: false,
          align: 'center',
          type: 'text',
          colSpan: () => 1,
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: string[] = [];
          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const rowIndex = index;
              const Total = `form.${rowIndex}.total`;
              const ChietKhau = `form.${rowIndex}.discountAmount`;
              const typeChietKhau = 'unitType';
              const checkType = 'audienceType';
              const billDiscountType = 'billDiscountType';
              const billDiscountRate = 'billDiscountRate';
              const billDiscountAmount = 'billDiscountAmount';
              const SLSP = `form.${rowIndex}.quantity`;
              const GIATIEN = `form.${rowIndex}.price`;
              arrayTotal.push(
                Total,
                ChietKhau,
                typeChietKhau,
                checkType,
                billDiscountType,
                billDiscountRate,
                billDiscountAmount,
                SLSP,
                GIATIEN
              );
            });
          }
          return (
            <ProFormDependency fields={arrayTotal}>
              {(values) => {
                let res2 = 0;
                let totalPrice = 0;
                getRows.forEach((row, index) => {
                  const {
                    ['unitType']: unitType,
                    ['audienceType']: audienceType,
                    ['billDiscountType']: billDiscountType,
                    ['billDiscountRate']: billDiscountRate,
                    ['billDiscountAmount']: billDiscountAmount,
                    [`form.${index}.total`]: total,
                    [`form.${index}.discountAmount`]: discountAmount,
                    [`form.${index}.quantity`]: quantity,
                    [`form.${index}.price`]: price,
                  } = values;
                  const requestPriceAsNumber = parseFloat(price);
                  const requestQuantityAsNumber = parseFloat(quantity);
                  const totalVnd =
                    requestQuantityAsNumber * requestPriceAsNumber;
                  totalPrice = totalVnd;

                  const BDA = billDiscountAmount
                    ? parseFloat(billDiscountAmount)
                    : 0;
                  const DCR = discountAmount ? parseFloat(discountAmount) : 0;
                  if (BDA && BDA > 0) {
                    if (billDiscountType === 0) {
                      if (totalPrice) {
                        res2 += (totalPrice * BDA) / 100;
                      }
                    } else {
                      if (totalPrice) {
                        res2 = BDA;
                      }
                    }
                  } else {
                    if (unitType === 0 && DCR) {
                      res2 += (totalPrice * DCR) / 100;
                    } else {
                      res2 += DCR;
                    }
                  }
                });

                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                    {res2 ? Numeral.price(res2) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
      }),
      columnHelper.accessor('totalPriceAfterDiscount', {
        id: 'totalPriceAfterDiscount',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.totalPriceAfterDiscount,
        cell: (context) => {
          const rowIndex = context.row.index;
          const ChietKhau = `form.${rowIndex}.discountAmount`;
          return (
            <Stack direction="column">
              <Typography>{Numeral.price(context.getValue())} </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.totalPriceAfterDiscount,
          editable: false,
          align: 'center',
          type: 'text',
          colSpan: () => 1,
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: string[] = [];
          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const rowIndex = index;
              const Total = `form.${rowIndex}.totalPriceAfterDiscount`;
              arrayTotal.push(Total);
            });
          }
          return (
            <ProFormDependency fields={arrayTotal}>
              {(values) => {
                let res2 = 0;
                for (const item in values) {
                  if (values[item]) {
                    res2 += values[item] ? values[item] : 0;
                  }
                }
                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                    {res2 ? Numeral.price(res2) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          return (
            <Stack direction="column">
              <Typography>{context.getValue()} </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
          editable: false,
          align: 'center',
          type: 'text',
          colSpan: () => 1,
        },
      }),
      //   {
      //     id: 'actions',
      //     size: 65,
      //     enableSorting: false,
      //     header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
      //     cell: (context) => {
      //       const rowIndex = context.row.index;
      //       return (
      //         <ProMenu
      // 		disabled
      //           position="left"
      //           items={[
      //             {
      //               label: 'Hiện ô nhập ghi chú',
      //               value: 1,
      //               actionType: 'description',
      //               onSelect: () => {
      //                 setCheckNote((prev) => [...prev, rowIndex]);
      //               },
      //             },
      //             {
      //               label: 'Xóa sản phẩm',
      //               value: 2,
      //               actionType: 'delete',
      //             },
      //           ]}
      //         >
      //           <ActionIconButton actionType="action" />
      //         </ProMenu>
      //       );
      //     },
      //     meta: {
      //       title: HEAD_CELLS.actions,
      //       align: 'center',
      //       colSpan: () => 1,
      //     },
      //   },
    ];
  }, [pageNumber, pageSize, checkNote]);

  return { columns };
};

export default useTableColumns;
