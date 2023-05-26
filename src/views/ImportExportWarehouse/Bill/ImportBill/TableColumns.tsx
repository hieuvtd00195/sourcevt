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
import { PriceDecimalInput, PriceInput, SaleInput } from 'plugins/NumberFormat';
import filter from 'lodash.filter';
import _, { isEmpty } from 'lodash';
import styled from '@emotion/styled';
import ProFormTextInerField from 'components/ProTable/core/EditableCell/ProFormTextInerField';
import ProFormTextHeaderField from 'components/ProTable/core/EditableCell/ProFormTextHeaderField';
import useDialog from 'hooks/useDialog';
import EditableCellNotSubRows from 'components/ProTable/core/EditTableCellValueInput/EditableCellNotSubRows';


const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  stt: 'STT',
  index: 'ID',
  productId: 'Mã sản phẩm',
  unitName: 'ĐVT',
  stockQuantity: 'Tồn',
  product: 'Sản Phẩm',
  quantity: 'SL',
  IMEI: 'IMEI',
  price: 'Giá',
  total: 'Thành tiền',
  discountAmount: 'Chiết khấu',
  khoiLuong: 'Khối lượng',
  quantityglo: 'SL-HD',
  actions: 'Hành động',
  totalAll: 'Tổng',
  note: 'note',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  onUpdate: (rowIndex: number, rowId: string) => () => Promise<void>;
  onDelete: (rowIndex: number, rowId: string) => () => void;
  onSetAllPrice: (type: string) => () => Promise<void>;
  setValue: any;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, onSetAllPrice, setValue, onDelete } = props;
  const [checkNote, setCheckNote] = useState<number[]>([]);
  const dialog = useDialog();
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
          colSpan: () => null,
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
              {checkNote.includes(rowIndex) ? (
                <ProFormTextInerField
                  rowIndex={rowIndex}
                  columnId="note"
                  multiple={true}
                  FormTextFieldProps={
                    {
                      // validate: Validation.string(),
                    }
                  }
                />
              ) : null}
            </Stack>
          );
        },

        meta: {
          title: HEAD_CELLS.product,
          colSpan: () => null,
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
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('stockQuantity', {
        id: 'stockQuantity',
        size: 50,
        enableSorting: false,

        header: () => HEAD_CELLS.stockQuantity,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.stockQuantity,
          align: 'right',
          colSpan: () => 4,
        },
        footer: (context) => <Typography variant="subtitle2">Tổng</Typography>,
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 150,
        header: (context) => {
          return (
            <>
              {/* <ProFormTextField
                placeholder="SL"
                size="small"
                name="quantityInput"
                onChange={(e) => {
                  setValue(`quantityInput`, e.target.value);
                }}
                InputProps={{
                  inputComponent: PriceInput,
                  // endAdornment: <ProInputAdornment>VND</ProInputAdornment>,
                }}
              /> */}
              <ProFormTextHeaderField
                // disabled={billDiscountAmount ? true : false}
                placeholder="SL"
                columnId="quantityInput"
                FormTextFieldProps={{
                  InputProps: {
                    inputComponent: PriceInput,
                  },
                }}
              />
              <ActionIconButton
                actionType="arrowDown"
                onClick={onSetAllPrice('quantityInput')}
              />
            </>
          );
        },
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue<string>();
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceDecimalInput,
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
                  if (!isEmpty(values[item])) {
                    res += parseFloat(values[item]);
                  }
                }
                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                    {res ? Numeral.price(res) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.quantity,
          editable: true,
          align: 'left',
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
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        header: (context) => {
          return (
            <>
              <ProFormTextHeaderField
                // disabled={billDiscountAmount ? true : false}
                placeholder="Giá"
                columnId="priceInput"
                FormTextFieldProps={{
                  InputProps: {
                    inputComponent: PriceDecimalInput,
                  },
                }}
              />
              <ActionIconButton
                actionType="arrowDown"
                onClick={onSetAllPrice('priceInput')}
              />
            </>
          );
        },
        enableSorting: false,
        cell: (context) => {
          return (
            <EditableCellNotSubRows
              context={context}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceDecimalInput,
                },
              }}
            />
            // <EditableCell
            //   context={context}
            //   FormTextFieldProps={{
            //     InputProps: {
            //       inputComponent: PriceDecimalInput,
            //     },
            //   }}
            // />
          );
        },
        meta: {
          title: HEAD_CELLS.price,
          editable: true,
          type: 'text',
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.total,
        cell: (context) => {
          const rowIndex = context.row.index;
          const SLSP = `form.${rowIndex}.quantity`;
          const GIATIEN = `form.${rowIndex}.price`;
          return (
            <ProFormDependency fields={[SLSP, GIATIEN]}>
              {(values) => {
                const { [SLSP]: quantity, [GIATIEN]: price } = values;
                const requestPriceAsNumber = parseFloat(price);
                const requestQuantityAsNumber = parseFloat(quantity);

                const totalVnd = requestPriceAsNumber * requestQuantityAsNumber;
                return (
                  <EditableCell
                    context={context}
                    checkTotal={true}
                    valueTotal={totalVnd}
                    render={() => Numeral.price(totalVnd)}
                    FormTextFieldProps={{
                      validate: Validation.pattern(
                        Regexs.number,
                        'Số không hợp lệ'
                      ).default('0'),
                      InputProps: {
                        inputComponent: PriceDecimalInput,
                      },
                    }}
                  />
                );
              }}
            </ProFormDependency>
          );
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: string[] = [];
          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const rowIndex = index;
              const Total = `form.${rowIndex}.total`;
              arrayTotal.push(Total);
            });
          }
          return (
            <ProFormDependency fields={arrayTotal}>
              {(values) => {
                let res2 = 0;
                for (const item in values) {
                  if (values[item]) {
                    res2 += values[item];
                  }
                }
                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
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
          align: 'right',
          colSpan: () => 3,
        },
      }),
      columnHelper.accessor('discountAmount', {
        id: 'discountAmount',
        size: 250,
        enableSorting: false,
        header: () => {
          const checkType = 'audienceType';
          const BDRate = 'billDiscountRate';
          const BDAmount = 'billDiscountAmount';
          const unitTypeD = 'unitType';
          return (
            <ProFormDependency
              fields={[checkType, BDRate, BDAmount, unitTypeD]}
            >
              {(values) => {
                const {
                  [checkType]: audienceType,
                  [BDRate]: billDiscountRate,
                  [BDAmount]: billDiscountAmount,
                  [unitTypeD]: unitType,
                } = values;

                return (
                  <>
                    <Tooltip title={'Chiết khấu'}>
                      <Grid container>
                        <Grid item xs={4} sm={4} md={4} lg={4}>
                          <ProFormSelect
                            disabled={
                              billDiscountAmount || audienceType === 4
                                ? true
                                : false
                            }
                            name="unitType"
                            defaultValue={0}
                            options={[
                              { value: 0, label: '%' },
                              { value: 1, label: 'VND' },
                            ]}
                            onSelect={(value) => {
                              setValue('unitType', value);
                            }}
                            placeholder="Chiết khấu"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                          {/* <ProFormTextField
                            disabled={
                              billDiscountRate || billDiscountAmount
                                ? true
                                : false
                            }
                            placeholder="Chiết khấu"
                            size="small"
                            name="valueSale"
                            onChange={(e) => {
                              setValue(`saleValue`, e.target.value);
                            }}
                            InputProps={{
                              inputComponent: PriceInput,
                            }}
							
                          /> */}
                          <ProFormTextHeaderField
                            disabled={
                              billDiscountAmount || audienceType === 4
                                ? true
                                : false
                            }
                            columnId="saleValue"
                            FormTextFieldProps={{
                              InputProps: {
                                inputComponent:
                                  unitType === 0
                                    ? SaleInput
                                    : PriceDecimalInput,
                              },
                            }}
                          />
                          <ActionIconButton
                            actionType="arrowDown"
                            onClick={onSetAllPrice('saleValue')}
                          />
                        </Grid>
                        {/* <Grid item xs={2} sm={2} md={2} lg={2}>
						  <ActionIconButton actionType="arrowDown" />
						</Grid> */}
                      </Grid>
                    </Tooltip>
                  </>
                );
              }}
            </ProFormDependency>
          );
        },
        cell: (context) => {
          const rowIndex = context.row.index;
          const SLSP = `form.${rowIndex}.quantity`;
          const GIATIEN = `form.${rowIndex}.price`;
          const ChietKhau = `form.${rowIndex}.discountAmount`;
          const typeChietKhau = 'unitType';
          const checkType = 'audienceType';
          const BDRate = 'billDiscountRate';
          const BDAmount = 'billDiscountAmount';

          return (
            <ProFormDependency
              fields={[
                SLSP,
                GIATIEN,
                ChietKhau,
                typeChietKhau,
                checkType,
                BDRate,
                BDAmount,
              ]}
            >
              {(values) => {
                const {
                  [SLSP]: quantity,
                  [GIATIEN]: price,
                  [ChietKhau]: discountRate,
                  [typeChietKhau]: unitType,
                  [checkType]: audienceType,
                  [BDRate]: billDiscountRate,
                  [BDAmount]: billDiscountAmount,
                } = values;
                const requestPriceAsNumber = parseFloat(price);
                const requestQuantityAsNumber = parseFloat(quantity);
                return (
                  <EditableCell
                    disable={
                      billDiscountAmount || audienceType === 4 ? true : false
                    }
                    context={context}
                    FormTextFieldProps={{
                      InputProps: {
                        inputComponent:
                          unitType === 0 ? SaleInput : PriceDecimalInput,
                      },
                    }}
                  />
                  // <EditableCell
                  //   disable={
                  //     billDiscountAmount || audienceType === 4 ? true : false
                  //   }
                  //   context={context}
                  //   FormTextFieldProps={{
                  //     InputProps: {
                  //       inputComponent: unitType === 0 ? SaleInput : PriceDecimalInput,
                  //     },
                  //   }}
                  // />
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.discountAmount,
          editable: true,
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
              arrayTotal.push(
                Total,
                ChietKhau,
                typeChietKhau,
                checkType,
                billDiscountType,
                billDiscountRate,
                billDiscountAmount
              );
            });
          }
          return (
            <ProFormDependency fields={arrayTotal}>
              {(values) => {
                let res2 = 0;
                getRows.forEach((row, index) => {
                  const {
                    ['unitType']: unitType,
                    ['audienceType']: audienceType,
                    ['billDiscountType']: billDiscountType,
                    ['billDiscountRate']: billDiscountRate,
                    ['billDiscountAmount']: billDiscountAmount,
                    [`form.${index}.total`]: total,
                    [`form.${index}.discountAmount`]: discountAmount,
                  } = values;
                  const BDA = billDiscountAmount
                    ? parseFloat(billDiscountAmount)
                    : 0;
                  const DCR = discountAmount ? parseFloat(discountAmount) : 0;
                  if (audienceType === 4) {
                    return;
                  }
                  if (BDA && BDA !== 0) {
                    if (billDiscountType === 0) {
                      if (total) {
                        res2 += (total * BDA) / 100;
                      }
                    } else {
                      if (total) {
                        res2 = BDA;
                      }
                    }
                  } else {
                    if (unitType === 0 && DCR) {
                      res2 += (total * DCR) / 100;
                    } else {
                      res2 += DCR;
                    }
                  }
                });

                return (
                  <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                    {res2 ? Numeral.price(res2) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const rowId = context.row.id;
          const rowIndex = context.row.index;
          const handleDeleteRow = () => {
            dialog({
              supportingText: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
              onConfirm: onDelete(rowIndex, rowId),
            });
          };

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Hiện ô nhập ghi chú',
                  value: 1,
                  actionType: 'description',
                  onSelect: () => {
                    setCheckNote((prev) => [...prev, rowIndex]);
                  },
                },
                {
                  label: 'Xóa sản phẩm',
                  value: 2,
                  actionType: 'delete',
                  onSelect: () => {
                    handleDeleteRow();
                  },
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
          colSpan: () => 1,
        },
      },
    ];
  }, [pageNumber, pageSize, checkNote, dialog]);

  return { columns };
};

export default useTableColumns;
