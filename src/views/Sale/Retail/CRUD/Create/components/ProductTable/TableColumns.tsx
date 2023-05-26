import ImageIcon from '@mui/icons-material/Image';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SouthIcon from '@mui/icons-material/South';
import { Box, Grid, MenuItem, Select, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormDependency from 'components/ProForm/ProFormDependency';
import ProInputAdornment from 'components/ProForm/ProInputAdornment';
import ProMenu from 'components/ProMenu';
import EditTableCellValueInput from 'components/ProTable/core/EditTableCellValueInput';
import EditableCellSubRows from 'components/ProTable/core/EditTableCellValueInput/EditableCellSubRows';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { PriceDecimalInput, PriceInput, SaleInput } from 'plugins/NumberFormat';
import { Fragment, useMemo } from 'react';
import Numeral from 'utils/Numeral';
import Validation from 'utils/Validation';
import { isEmpty } from 'lodash';
import ProFormTextHeaderField from 'components/ProTable/core/EditableCell/ProFormTextHeaderField';
interface TableCreateProducts {
  [key: string]: any;
}
const columnHelper = getColumnHelper<TableCreateProducts>();

const HEAD_CELLS: HeadCell<TableCreateProducts> = {
  index: 'ID',
  image: 'Ảnh sản phẩm',
  productName: 'Sản phẩm',
  productId: 'Mã sản phẩm',
  price: 'Giá',
  quantity: 'SL',
  inventory: 'Tồn có thể bán',
  payment: 'Thành Tiền',
  discountValue: 'Chiết khấu',
  discountUnit: 'Đơn vị chiết khấu',
  total: 'Tổng',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
  onAddChildProduct: (id: string, name: string) => void;
  setValue: any;
  onSetAllPrice: (type: string) => () => Promise<void>;
  onDelete: (rowIndex: number, rowId: string,childrenCheck: boolean) => () => void;
}

const useTableColumns = (props: Props) => {
  const { handleOpenDialog, setValue, onSetAllPrice,onDelete } = props;
  const dialog = useDialog();

  const columns: ProColumn<TableCreateProducts> = useMemo(() => {
    return [
      columnHelper.accessor('image', {
        id: 'image',
        size: 20,
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
      columnHelper.display({
        id: 'productName',
        size: 150,
        header: () => HEAD_CELLS.productName,
        cell: ({ row }) => {
          const rowIndex = row.index;
          const productName = row?.original.productName;
          const rowParentIndex = row.original?.parentIndex;
          const SLPRODUCTBONUS = `form.${rowIndex}.productBonus`;

          return (
            <ProFormDependency fields={[SLPRODUCTBONUS]}>
              {(values) => {
                const { [SLPRODUCTBONUS]: productBonus } = values;
                return (
                  <Box
                    style={{
                      paddingLeft: `${row.depth * 2}rem`,
                    }}
                  >
                    <div>{productName}</div>
                    {!rowParentIndex?.toString() && (
                      <>
                        {productBonus && productBonus.length > 0 ? (
                          <div
                            style={{
                              marginLeft: `10px`,
                            }}
                          >
                            {productBonus.length} x quà tặng
                          </div>
                        ) : null}
                      </>
                    )}
                  </Box>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.productName,
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        header: () => HEAD_CELLS.price,
        cell: (context) => {
          return (
            <EditTableCellValueInput
              context={context}
              disable={false}
              FormTextFieldProps={{
                InputProps: {
                  endAdornment: <ProInputAdornment>VND</ProInputAdornment>,
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
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 50,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => (
          <EditTableCellValueInput
            context={context}
            FormTextFieldProps={{
              InputProps: {
                inputComponent: PriceDecimalInput,
              },
            }}
          />
        ),
        meta: {
          title: HEAD_CELLS.quantity,
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('inventory', {
        id: 'inventory',
        size: 50,
        header: () => (
          <Tooltip title={HEAD_CELLS.inventory}>
            <Box>Tồn</Box>
          </Tooltip>
        ),
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.inventory,
        },
      }),
      columnHelper.accessor('payment', {
        id: 'payment',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.payment,
        cell: (context) => {
          const rowIndex = context.row.index;
          const rowParentIndex = context.row.original?.parentIndex;
          const SLSP = `form.${rowIndex}.quantity`;
          const GIATIEN = `form.${rowIndex}.price`;
          const SLSPCHILD = `form.${rowParentIndex}.productChildren.${rowIndex}.quantity`;
          const GIATIENCHILD = `form.${rowParentIndex}.productChildren.${rowIndex}.price`;
          return (
            <ProFormDependency
              fields={[SLSP, GIATIEN, SLSPCHILD, GIATIENCHILD]}
            >
              {(values) => {
                const {
                  [SLSP]: quantity,
                  [GIATIEN]: price,
                  [SLSPCHILD]: quantityChil,
                  [GIATIENCHILD]: priceChil,
                } = values;

                let totalVnd = 0;
                if (rowParentIndex?.toString()) {
                  const requesChilAsNumber = priceChil
                    ? parseFloat(priceChil)
                    : 0;
                  const requestQuantityChilAsNumber = quantityChil
                    ? parseFloat(quantityChil)
                    : 0;
                  totalVnd = requesChilAsNumber * requestQuantityChilAsNumber;
                } else {
                  const requestPriceAsNumber = price ? parseFloat(price) : 0;
                  const requestQuantityAsNumber = quantity
                    ? parseFloat(quantity)
                    : 0;
                  totalVnd = requestPriceAsNumber * requestQuantityAsNumber;
                }

                return (
                  <EditTableCellValueInput
                    context={context}
                    checkTotal={true}
                    valueTotal={totalVnd ? totalVnd : '0'}
                    render={() => (totalVnd ? Numeral.price(totalVnd) : '0')}
                    FormTextFieldProps={{
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
          title: HEAD_CELLS.payment,
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('discountValue', {
        id: 'discountValue',
        size: 250,
        enableSorting: false,
        header: () => {
          const discountTypeHeader = 'discountTypeHeader';
          const discountValue = 'discountValue';
          return (
            <ProFormDependency fields={[discountTypeHeader, discountValue]}>
              {(values) => {
                const {
                  [discountTypeHeader]: discountTypeCheck,
                  [discountValue]: discountValueCheck,
                } = values;
                return (
                  <>
                    <Tooltip title={'Chiết khấu'}>
                      <Grid container>
                        <Grid item xs={4} sm={4} md={4} lg={4}>
                          <ProFormSelect
                            name="discountTypeHeader"
                            defaultValue={0}
                            disabled={discountValueCheck ? true : false}
                            options={[
                              { value: 0, label: '%' },
                              { value: 1, label: 'VND' },
                            ]}
                            onSelect={(value) => {
                              setValue('discountTypeHeader', value);
                            }}
                            placeholder="Chiết khấu"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                          <ProFormTextHeaderField
                            columnId="discountValueHeader"
                            disabled={discountValueCheck ? true : false}
                            FormTextFieldProps={{
                              InputProps: {
                                inputComponent:
                                  discountTypeCheck === 0
                                    ? SaleInput
                                    : PriceDecimalInput,
                              },
                            }}
                          />
                          <ActionIconButton
                            actionType="arrowDown"
                            onClick={onSetAllPrice('discountHeaderSaleValue')}
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
        cell: (context) => {
          const rowIndex = context.row.index;
          const rowParentIndex = context.row.original?.parentIndex;
          const DCUT = `form.${rowIndex}.discountUnit`;
          const FORMSATE = `form.${rowIndex}`;
          const discountValue = 'discountValue';
          return (
            <ProFormDependency fields={[DCUT, FORMSATE, discountValue]}>
              {(values) => {
                const {
                  [DCUT]: discountUnit,
                  [discountValue]: discountValueCheck,
                } = values;

                return (
                  <Grid container sx={{ marginBottom: 1, marginTop: 1 }}>
                    <Grid item xs={0}>
                      <ProFormSelect
                        name={
                          rowParentIndex?.toString()
                            ? `form.${rowParentIndex}.productChildren.${rowIndex}.discountUnit`
                            : `form.${rowIndex}.discountUnit`
                        }
                        defaultValue={0}
                        options={[
                          { value: 0, label: '%' },
                          { value: 1, label: 'VND' },
                        ]}
                        style={{ display: 'none' }}
                        placeholder="%"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <EditTableCellValueInput
                        context={context}
                        disable={discountValueCheck ? true : false}
                        FormTextFieldProps={{
                          InputProps: {
                            inputComponent:
                              discountUnit === 0
                                ? SaleInput
                                : PriceDecimalInput,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.discount,
          type: 'text',
          editable: true,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.total,
        cell: (context) => {
          const rowIndex = context.row.index;
          const rowParentIndex = context.row.original?.parentIndex;
          const SLSP = `form.${rowIndex}.quantity`;
          const GIATIEN = `form.${rowIndex}.price`;
          const CHIETKHAU = `form.${rowIndex}.discountValue`;
          const LOAICHIETKHAU = `form.${rowIndex}.discountUnit`;
          const SLSPCHILD = `form.${rowParentIndex}.productChildren.${rowIndex}.quantity`;
          const GIATIENCHILD = `form.${rowParentIndex}.productChildren.${rowIndex}.price`;
          const CHIETKHAUCHILD = `form.${rowParentIndex}.productChildren.${rowIndex}.discountValue`;
          const LOAICHIETKHAUCHILD = `form.${rowParentIndex}.productChildren.${rowIndex}.discountUnit`;
          const DCVL = 'discountValue';
          const DCUN = 'discountUnit';
          return (
            <ProFormDependency
              fields={[
                SLSP,
                GIATIEN,
                CHIETKHAU,
                LOAICHIETKHAU,
                SLSPCHILD,
                GIATIENCHILD,
                CHIETKHAUCHILD,
                LOAICHIETKHAUCHILD,
                DCVL,
                DCUN,
              ]}
            >
              {(values) => {
                const {
                  [SLSP]: quantity,
                  [GIATIEN]: price,
                  [CHIETKHAU]: discountValue,
                  [LOAICHIETKHAU]: discountUnit,
                  [SLSPCHILD]: quantityChil,
                  [GIATIENCHILD]: priceChil,
                  [CHIETKHAUCHILD]: discountValueChil,
                  [LOAICHIETKHAUCHILD]: discountUnitChil,
                  [DCVL]: discountValueGlobal,
                  [DCUN]: discountUnitGlobal,
                } = values;

                let total = 0;
                const requestPriceAsNumber = price ? parseFloat(price) : 0;
                const requestQuantityAsNumber = quantity
                  ? parseFloat(quantity)
                  : 0;
                const requestdiscountValueNumber = discountValue
                  ? parseFloat(discountValue)
                  : 0;
                const requestdiscountUnit = discountUnit
                  ? parseFloat(discountUnit)
                  : 0;
                const requestPriceChilAsNumber = priceChil
                  ? parseFloat(priceChil)
                  : 0;
                const requestQuantityChilAsNumber = quantityChil
                  ? parseFloat(quantityChil)
                  : 0;
                const requestdiscountValueChilNumber = discountValueChil
                  ? parseFloat(discountValueChil)
                  : 0;
                const requestdiscountUnitChil = discountUnitChil
                  ? parseFloat(discountUnitChil)
                  : 0;
                const discountValueGlobalAsNumber = discountValueGlobal
                  ? parseFloat(discountValueGlobal)
                  : 0;
                // const requestPriceChildrenAsNumber = parseFloat()
                if (discountValueGlobal) {
                  if (rowParentIndex?.toString()) {
                    const totalVnd =
                      requestPriceChilAsNumber * requestQuantityChilAsNumber;
                    if (discountUnitGlobal === 0) {
                      let CK = (totalVnd * discountValueGlobalAsNumber) / 100;
                      total = totalVnd;
                    } else {
                      total = totalVnd;
                    }
                  } else {
                    const totalVnd =
                      requestPriceAsNumber * requestQuantityAsNumber;
                    if (discountUnitGlobal === 0) {
                      let CK = (totalVnd * discountValueGlobalAsNumber) / 100;
                      total = totalVnd;
                    } else {
                      total = totalVnd;
                    }
                  }
                } else {
                  if (rowParentIndex?.toString()) {
                    const totalVnd =
                      requestPriceChilAsNumber * requestQuantityChilAsNumber;
                    if (requestdiscountUnitChil === 0) {
                      let CK =
                        (totalVnd * requestdiscountValueChilNumber) / 100;
                      total = totalVnd - CK;
                    } else {
                      total = totalVnd - requestdiscountValueChilNumber;
                    }
                  } else {
                    const totalVnd =
                      requestPriceAsNumber * requestQuantityAsNumber;
                    if (requestdiscountUnit === 0) {
                      let CK = (totalVnd * requestdiscountValueNumber) / 100;
                      total = totalVnd - CK;
                    } else {
                      total = totalVnd - requestdiscountValueNumber;
                    }
                  }
                }

                return (
                  <EditTableCellValueInput
                    context={context}
                    checkTotal={true}
                    valueTotal={total ? total : '0'}
                    render={() => Numeral.price(total)}
                    FormTextFieldProps={{
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
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {

          const { productName, productId } = context.row.original;          
          const rowId = context.row.id;
          const rowIndex = context.row.index;
          const rowParentIndex = context.row.original?.parentIndex;
          
          const handleDeleteRow = () => {
            dialog({
              headline: 'Xóa sản phẩm',
              supportingText: (
                <Fragment>Bạn có chắc chắn muốn xóa sản phẩm này?</Fragment>
              ),
              onConfirm: rowParentIndex?.toString() ? onDelete(rowParentIndex, rowId , true) : onDelete(rowIndex, rowId, false) ,
            });
          };
          const handAddChildProduct = () => {
            dialog({
              headline: 'Sản phẩm đính kèm',
              supportingText: (
                <Fragment>
                  Thêm ngay sản phẩm đính kèm cho sản phẩm {productName}
                </Fragment>
              ),
              onConfirm: async () => {
                props.onAddChildProduct(productId, productName);
              },
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
                  label: 'Thêm quà tặng',
                  disabled: rowParentIndex?.toString() ? true : false,
                  value: 1,
                  actionType: 'gift',
                  onSelect: handleClickShowPopup,
                },
                {
                  label: 'Thêm sản phẩm con',
                  disabled: rowParentIndex?.toString() ? true : false,
                  value: 2,
                  actionType: 'addCicle',
                  onSelect: handAddChildProduct,
                },
                {
                  label: 'Xoá sản phẩm',
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
  }, []);

  return { columns };
};

export default useTableColumns;
