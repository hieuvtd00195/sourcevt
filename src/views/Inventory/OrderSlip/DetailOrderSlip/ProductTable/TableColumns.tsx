import CancelIcon from '@mui/icons-material/Cancel';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Typography } from '@mui/material';
import Validation from 'utils/Validation';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import Regexs from 'utils/Regexs';
import { TableCreateOrder } from '../utils/types';
import Index from 'components/ProTable/components/Index';
import Numeral from 'utils/Numeral';
import ProFormDependency from 'components/ProForm/ProFormDependency';
import { isEmpty } from 'lodash'
import { PriceInput } from 'plugins/NumberFormat';

const columnHelper = getColumnHelper<TableCreateOrder>();

const HEAD_CELLS: HeadCell<TableCreateOrder> = {
  index: 'STT',
  id: 'ID Sản phẩm',
  productId: 'Tên sản phẩm',
  requestQuantity: 'SL yêu cầu(*)',
  importQuantity: 'SL đã nhập',
  requestPrice: 'Giá yêu cầu(*)',
  suggestedPrice: 'Giá đề xuất',
  rate: 'TT tệ',
  total: 'Tổng tiền VND',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
  onDelete: (rowIndex: number, rowId: string) => () => void;
  onUpdate: (rowIndex: number, rowId: string) => () => Promise<void>;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, handleOpenDialog, onDelete, onUpdate } = props;
  const dialog = useDialog();

  const columns: ProColumn<TableCreateOrder> = useMemo(() => {
    return [
      Index<TableCreateOrder>(pageNumber, pageSize),
      columnHelper.accessor('id', {
        id: 'id',
        size: 30,
        header: () => HEAD_CELLS.id,
        enableSorting: false,
        cell: (context) => {
          return context.row.original.code;
        },
        meta: {
          title: HEAD_CELLS.product,
          align: 'center',
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('productId', {
        id: 'productId',
        enableSorting: false,
        size: 30,
        header: () => HEAD_CELLS.productId,
        cell: (context) => {
          return context.row.original.name;
        },
        meta: {
          title: HEAD_CELLS.name,
          align: 'center',
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('requestQuantity', {
        id: 'requestQuantity',
        enableSorting: false,
        size: 100,
        header: () => HEAD_CELLS.requestQuantity,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                // autoFocus: true,
                validate: Validation.pattern(
                  Regexs.number,
                  'Số lượng yêu cầu là số nguyên dương'
                ).required('Số lượng yêu cầu không được để trống'),
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.requestQuantity,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('importQuantity', {
        id: 'importQuantity',
        enableSorting: false,
        size: 10,
        header: () => HEAD_CELLS.importQuantity,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                // autoFocus: true,
                InputProps: {
                  inputComponent: PriceInput,
                },
                validate: Validation.pattern(
                  Regexs.number,
                  'Số lượng yêu cầu là số nguyên dương'
                ).required('Số lượng yêu cầu không được để trống'),
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.importQuantity,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('requestPrice', {
        id: 'requestPrice',
        enableSorting: false,
        size: 100,
        header: () => HEAD_CELLS.requestPrice,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                validate: Validation.pattern(
                  Regexs.decimal3,
                  'Giá yêu cầu chỉ bao gồm hai số sau dấu phẩy, không bao gồm ký tự đặc biệt hoặc chữ cái'
                ).required('Giá yêu cầu không được để trống'),
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.requestPrice,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('suggestedPrice', {
        id: 'suggestedPrice',
        enableSorting: false,
        size: 100,
        header: () => HEAD_CELLS.suggestedPrice,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                validate: Validation.patternNotRequired(Regexs.decimal3, 'Giá đề xuất chỉ bao gồm hai số sau dấu phẩy, không bao gồm ký tự đặc biệt hoặc chữ cái'),
              }}
            />
          );
        },
        footer: (context) => <Typography fontWeight="bold" sx={{ color: '#000000' }}>Tổng</Typography>,
        meta: {
          title: HEAD_CELLS.suggestedPrice,
          align: 'center',
          editable: false,
          type: 'text',
          colSpan: () => 3,
        },
      }),
      columnHelper.accessor('rate', {
        id: 'rate',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.rate,
        cell: (context) => {
          const rowIndex = context.row.index;
          const requestPrice = `form.${rowIndex}.requestPrice`;
          const requestQuantity = `form.${rowIndex}.requestQuantity`;
          return (
            <ProFormDependency fields={[requestPrice, requestQuantity]}>
              {(values) => {
                const { [requestPrice]: price, [requestQuantity]: quantity } =
                  values;
                const requestPriceAsNumber = parseFloat(price);
                const requestQuantityAsNumber = parseFloat(quantity);
                const totalCny = requestPriceAsNumber * requestQuantityAsNumber;
                return (
                  <EditableCell
                    context={context}
                    checkTotal={true}
                    valueTotal={totalCny}
                    render={() => Numeral.price(totalCny)}
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
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: string[] = [];
          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const rowIndex = index;
              const Total = `form.${rowIndex}.rate`;
              arrayTotal.push(Total);
            });
          }
          return (
            <ProFormDependency fields={arrayTotal}>
              {(values) => {
                let totalRate = 0;
                for (const item in values) {
                  if (values[item]) {
                    totalRate += values[item];
                  }
                }
                return (
                  <Typography fontWeight="bold" sx={{ color: '#000000', textAlign: 'right' }}>
                    {totalRate ? Numeral.price(totalRate) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          type: 'text',
          title: HEAD_CELLS.rate,
          align: 'center',
          colSpan: () => 1,
        },
      }),
      columnHelper.display({
        id: 'total',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.total,
        cell: (context) => {
          const rowIndex = context.row.index;
          const requestPrice = `form.${rowIndex}.requestPrice`;
          const requestQuantity = `form.${rowIndex}.requestQuantity`;
          const rate = 'rate';
          return (
            <ProFormDependency fields={[requestPrice, requestQuantity, rate]}>
              {(values) => {
                const {
                  [requestPrice]: price,
                  [requestQuantity]: quantity,
                  rate,
                } = values;
                const requestPriceAsNumber = parseFloat(price);
                const requestQuantityAsNumber = parseFloat(quantity);
                const rateAsNumber = parseFloat(rate);
                const totalVnd =
                  requestPriceAsNumber * requestQuantityAsNumber * rateAsNumber;

                return (
                  <EditableCell
                    context={context}
                    checkTotal={true}
                    valueTotal={totalVnd}
                    render={() => Numeral.price(totalVnd)}
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
                  <Typography fontWeight="bold" sx={{ color: '#000000', textAlign: 'right' }}>
                    {res2 ? Numeral.price(res2) : 0}
                  </Typography>
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          type: 'text',
          title: HEAD_CELLS.total,
          align: 'center',
          colSpan: () => 1,
        },
      }),
    //   {
    //     id: 'actions',
    //     size: 65,
    //     enableSorting: false,
    //     header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
    //     cell: (context) => {
    //       const handleClickShowPopup = () => {
    //         onDelete(context.row.index, context.row.original.id);
    //       };

    //       return (
    //         <CancelIcon
    //           onClick={onDelete(context.row.index, context.row.original.id)}
    //         />
    //       );
    //     },
    //     meta: {
    //       title: HEAD_CELLS.actions,
    //       align: 'center',
    //     },
    //   },
    ];
  }, [dialog, handleOpenDialog, onDelete, onUpdate]);

  return { columns };
};

export default useTableColumns;
