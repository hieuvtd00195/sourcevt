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
import ProFormDependency from 'components/ProForm/ProFormDependency';
import ProMenu from 'components/ProMenu';
import EditTableCellValueInput from 'components/ProTable/core/EditTableCellValueInput';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import Validation from 'utils/Validation';
import { PriceDecimalInput, PriceInput, SaleInput } from 'plugins/NumberFormat';
import { Fragment, useMemo } from 'react';
import Numeral from 'utils/Numeral';
import Regexs from 'utils/Regexs';
import ProFormTextHeaderField from 'components/ProTable/core/EditableCell/ProFormTextHeaderField';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { TableSaleReturn } from './utils/types';

const columnHelper = getColumnHelper<TableSaleReturn>();

const HEAD_CELLS: HeadCell<TableSaleReturn> = {
  // image: 'Ảnh sản phẩm',
  product: 'Sản phẩm',
  unit: 'ĐVT',
  price: 'Giá',
  quantity: 'SL',
  total: 'Thành Tiền',
  discount: 'Chiết khấu',
  totalAll: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  onDelete: (rowIndex: number, rowId: string) => () => void;
  handleBlur?: (e: any) => void;
  onSetAll: () => () => Promise<void>;
  setValue?: any;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, onDelete, handleBlur, setValue, onSetAll } = props;

  const dialog = useDialog();

  const columns: ProColumn<TableSaleReturn> = useMemo(() => {
    return [
      // columnHelper.display({
      //   id: 'selection',
      //   size: 60,
      //   maxSize: 60,
      //   minSize: 60,
      //   header: (info) => (
      //     <>
      //       <Checkbox
      //         checked={info.table.getIsAllRowsSelected()}
      //         indeterminate={info.table.getIsSomeRowsSelected()}
      //         onChange={info.table.getToggleAllRowsSelectedHandler()}
      //       />
      //       <ProMenu
      //         position="left"
      //         items={[
      //           {
      //             label: 'Xóa hóa đơn',
      //             value: 3,
      //             actionType: 'delete',
      //             onSelect: () => { },
      //           },
      //         ]}
      //       >
      //         <ActionIconButton actionType="arrowDown" />
      //       </ProMenu>
      //     </>
      //   ),
      //   cell: ({ row }) => (
      //     <Box>
      //       <Checkbox
      //         checked={row.getIsSelected()}
      //         indeterminate={row.getIsSomeSelected()}
      //         onChange={row.getToggleSelectedHandler()}
      //       />
      //     </Box>
      //   ),
      //   meta: {
      //     title: 'Chọn tất cả',
      //     // colSpan: () => null,
      //   },
      // }),
      columnHelper.accessor('product', {
        id: 'product',
        enableSorting: false,
        size: 30,
        header: () => HEAD_CELLS.product,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.product,
        },
      }),
      columnHelper.accessor('unit', {
        id: 'unit',
        size: 30,
        header: () => HEAD_CELLS.unit,
        cell: (context) => {
          const value = context.getValue();
          return value === 1 ? 'Cái' : 'Lô';
        },
        meta: {
          title: HEAD_CELLS.unit,
        },
        footer: (context) => (
          <>
            <Typography variant="subtitle2">Tổng</Typography>
            <Typography variant="subtitle2">Tổng phải trả</Typography>
          </>
        ),
      }),

      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 100,
        enableSorting: false,
        // header: () => HEAD_CELLS.quantity,
        header: (context) => {
          return (
            <>
              <ProFormTextField
                placeholder="SL"
                size="small"
                name="quantityInput"
                onChange={(e) => {
                  setValue(`quantityInput`, e.target.value);
                }}
                InputProps={{
                  inputComponent: PriceInput,
                }}
              />
              <ActionIconButton
                actionType="arrowDown"
                onClick={onSetAll()}
              />
            </>
          )
        },
        cell: (context) => {
          // const value = context.getValue<string>();
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
        meta: {
          title: HEAD_CELLS.quantity,
          editable: true,
          type: 'text',
          colSpan: () => null,

        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.price,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              disable={false}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceDecimalInput,
                },
              }}
            />
          );
        },
        footer: (props) => props.column.id,
        meta: {
          title: HEAD_CELLS.price,
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        enableSorting: false,
        size: 100,
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
        meta: {
          title: HEAD_CELLS.total,
          editable: true,
          type: 'text',
          align: 'right',
          colSpan: () => 3,
        },
      }),
      columnHelper.accessor('discount', {
        id: 'discount',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.discount,
        cell: (context) => {
          const checkType = 'audienceType';
          const BDRate = 'billDiscountRate';
          const BDAmount = 'billDiscountAmount';
          const unitTypeD = 'unit'
          const rowIndex = context.row.index;
          const { unit } = context.row.original
          const discountUnit = 'discountUnit';
          const discountValue = 'discountValue';

          return (
            <ProFormDependency fields={[discountUnit, discountValue]}>
              {(values) => {
                const { [discountUnit]: discountUnitValue, [discountValue]: discountValueOutside } = values;
                return (
                  <>
                    <Tooltip title={'Chiết khấu'}>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={4} md={4} lg={6}>
                          <ProFormSelect
                            // disabled={
                            //   billDiscountAmount || audienceType === 4
                            //     ? true
                            //     : false
                            // }
                            disabled={discountValueOutside}
                            name={`form.${rowIndex}.unit`}
                            defaultValue={0}
                            options={[
                              { value: 0, label: '%' },
                              { value: 1, label: 'VND' },
                            ]}
                            onSelect={(value) => {
                              setValue(`form.${rowIndex}.unit`, value);
                            }}
                            placeholder="Chiết khấu"
                          />
                        </Grid>
                        <Grid item xs={8} sm={8} md={8} lg={6}>
                          <EditableCell
                            context={context}
                            disable={discountValueOutside}
                            FormTextFieldProps={{
                              InputProps: {
                                inputComponent: unit === 1 ? SaleInput : PriceDecimalInput,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Tooltip>
                  </>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.discount,
          editable: true,
          type: 'text',
          align: 'center',
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('totalAll', {
        id: 'totalAll',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalAll,
        cell: (context) => {
          const rowIndex = context.row.index;
          const SLSP = `form.${rowIndex}.quantity`;
          const GIATIEN = `form.${rowIndex}.price`;
          const DISCOUNT = `form.${rowIndex}.discount`;
          const UNIT = `form.${rowIndex}.unit`;
          const discountValue = 'discountValue';

          return (
            <ProFormDependency fields={[SLSP, GIATIEN, DISCOUNT, UNIT, discountValue]}>
              {(values) => {
                const {
                  [SLSP]: quantity,
                  [GIATIEN]: price,
                  [DISCOUNT]: discount,
                  [UNIT]: unit,
                  [discountValue]: discountValueOutside
                } = values;
                const requestPriceAsNumber = parseFloat(price);
                const requestQuantityAsNumber = parseFloat(quantity);
                const requestDiscountAsNumber = parseFloat(discount);
                // const requestUnitAsNumber = parseFloat(unit);
                let totalVnd = 0;

                if (discountValueOutside) {
                  totalVnd = requestPriceAsNumber * requestQuantityAsNumber;
                } else {
                  if (requestDiscountAsNumber) {
                    if (unit === 1) {
                      totalVnd = requestPriceAsNumber * requestQuantityAsNumber - requestDiscountAsNumber;
                    } else {
                      totalVnd = (requestPriceAsNumber * requestQuantityAsNumber) - (requestPriceAsNumber * requestQuantityAsNumber) * (requestDiscountAsNumber / 100);
                    }
                  } else {
                    totalVnd = requestPriceAsNumber * requestQuantityAsNumber;
                  }
                }

                return (
                  <Typography variant="subtitle2">{totalVnd | 0}</Typography>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.totalAll,
          editable: true,
          type: 'text',
          align: 'right',
          colSpan: () => 3,
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
              onConfirm: onDelete(context.row.index, context.row.original.id)
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
