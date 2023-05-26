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

import Index from 'components/ProTable/components/Index';
import Numeral from 'utils/Numeral';
import ProFormDependency from 'components/ProForm/ProFormDependency';
import { isEmpty } from 'lodash';
import { PriceInput } from 'plugins/NumberFormat';
import { TableCreateOrder } from '../DetailOrderSlip/utils/types';

const columnHelper = getColumnHelper<TableCreateOrder>();

const HEAD_CELLS: HeadCell<TableCreateOrder> = {
  index: 'STT',
  id: 'ID Sản phẩm',
  productId: 'Sản phẩm',
  requestQuantity: 'SL yêu cầu',
  importQuantity: 'SL đã nhập',
  requestPrice: 'Giá yêu cầu',
  totalRequestVnd: 'Tổng VND YC',
  totalInputVnd: 'Tổng VND đã nhập',
  unitPriceVnd: 'Đơn giá VND',
  ratePrice: 'Giá cước',
  priceImportVnd: 'Giá nhập VND',
  quantity: 'SL nhập',
  note: 'Ghi chú',
  TTtruoccuoc: 'TT Trước cước',
  TTsaucuoc: 'TT sau cước',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  open: boolean;
  handleClose: () => void;
  //   handleOpenDialog: (value: any) => void;
  //   onDelete: (rowIndex: number, rowId: string) => () => void;
    onUpdate: (rowIndex: number, rowId: string) => () => Promise<void>;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize,open,handleClose,onUpdate } = props;
  const dialog = useDialog();

  const columns: ProColumn<TableCreateOrder> = useMemo(() => {
    return [
      Index<TableCreateOrder>(pageNumber, pageSize),
      columnHelper.accessor('productId', {
        id: 'productId',
        enableSorting: false,
        size: 10,
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
        size: 10,
        header: () => HEAD_CELLS.requestQuantity,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceInput,
                },
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
        size: 10,
        header: () => HEAD_CELLS.requestPrice,
        cell: (context) => {
          const { requestPrice } = context.row.original;
          return (
            <EditableCell
              context={context}
              render={() => Numeral.price(requestPrice)}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceInput,
                },

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
      columnHelper.accessor('totalRequestVnd', {
        id: 'totalRequestVnd',
        enableSorting: false,
        size: 10,
        header: () => HEAD_CELLS.totalRequestVnd,
        cell: (context) => {
          const { totalRequestVnd } = context.row.original;
          return (
            <EditableCell
              context={context}
              render={() => Numeral.price(totalRequestVnd)}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceInput,
                },

                validate: Validation.pattern(
                  Regexs.decimal3,
                  'Giá yêu cầu chỉ bao gồm hai số sau dấu phẩy, không bao gồm ký tự đặc biệt hoặc chữ cái'
                ).required('Giá yêu cầu không được để trống'),
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.totalRequestVnd,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.display({
        id: 'totalInputVnd',
        enableSorting: false,
        enableResizing: true,
        header: () => {
          return (
            <>
              <div>{HEAD_CELLS.totalInputVnd}</div>
            </>
          );
        },
        cell: (context) => {
          const { totalInputVnd } = context.row.original;
          return (
            <EditableCell
              context={context}
              render={() => Numeral.price(totalInputVnd)}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceInput,
                },

                validate: Validation.pattern(
                  Regexs.decimal3,
                  'Giá yêu cầu chỉ bao gồm hai số sau dấu phẩy, không bao gồm ký tự đặc biệt hoặc chữ cái'
                ).required('Giá yêu cầu không được để trống'),
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.totalInputVnd,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('unitPriceVnd', {
        id: 'unitPriceVnd',
        enableSorting: false,
        size: 10,
        header: () => HEAD_CELLS.unitPriceVnd,
        cell: (context) => {
          const { unitPriceVnd } = context.row.original;
          return (
            <EditableCell
              context={context}
              render={() => Numeral.price(unitPriceVnd)}
              FormTextFieldProps={{
                InputProps: {
                  inputComponent: PriceInput,
                },
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.totalInputVnd,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('ratePrice', {
        id: 'ratePrice',
        enableSorting: false,
        header: () => HEAD_CELLS.ratePrice,
        cell: (context) => {
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
        meta: {
          title: HEAD_CELLS.totalInputVnd,
          align: 'center',
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.display({
        id: 'priceImportVnd',
        enableSorting: false,
        header: () => HEAD_CELLS.priceImportVnd,
        cell: (context) => {
          const rowIndex = context.row.index;
          const unitPriceVndD = `form.${rowIndex}.unitPriceVnd`
          const rateD = 'rate'
          const requestPriceD = `form.${rowIndex}.requestPrice`
          const ratePriceD = `form.${rowIndex}.ratePrice`
          
          return (
            <ProFormDependency fields={[unitPriceVndD,ratePriceD,rateD,requestPriceD]}>
              {(values) => {
                const {[unitPriceVndD]:unitPriceVnd,[ratePriceD]:ratePrice,[rateD]:rate,[requestPriceD]: requestPrice } =
                  values;
                const UnitPriceAsNumber = unitPriceVnd ? parseFloat(unitPriceVnd) : 0;
                const rateAsNumber = rate ? parseFloat(rate) : 0 ;
                const requestPriceAsNumber = requestPrice ? parseFloat(requestPrice) : 0 ;
                const RatePriceAsNumber = ratePrice ? parseFloat(ratePrice) : 0;
                const TotalGiaNhap = (requestPriceAsNumber * rate ) + RatePriceAsNumber


                const totalCny = UnitPriceAsNumber + RatePriceAsNumber;
                return (
                  <EditableCell
                    context={context}
                    checkTotal={true}
                    valueTotal={TotalGiaNhap}
                    render={() => Numeral.price(TotalGiaNhap)}
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
          title: HEAD_CELLS.priceImportVnd,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        enableSorting: false,

        header: () => HEAD_CELLS.quantity,
        cell: (context) => {
          const { unitPriceVnd } = context.row.original;
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
        meta: {
          title: HEAD_CELLS.quantity,
          align: 'center',
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        enableSorting: false,

        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const { unitPriceVnd } = context.row.original;
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
               
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.note,
          align: 'center',
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.display({
        id: 'TTtruoccuoc',
        enableSorting: false,
        header: () => HEAD_CELLS.TTtruoccuoc,
        cell: (context) => {
          const rowIndex = context.row.index;
          const unitPriceVndD = `form.${rowIndex}.unitPriceVnd`
          const quantityD = `form.${rowIndex}.quantity`
          const ratePriceD = `form.${rowIndex}.ratePrice`
          return (
            <ProFormDependency fields={[unitPriceVndD,quantityD,ratePriceD]}>
              {(values) => {
                const {[unitPriceVndD]:unitPriceVnd,[quantityD]:quantity, [ratePriceD]:ratePrice } =
                  values;
                const UnitPriceAsNumber = unitPriceVnd  ? parseFloat(unitPriceVnd) : 0;
                const QuantityAsNumber = parseFloat(quantity);
                const RatePriceAsNumber = ratePrice ? parseFloat(ratePrice) : 0;
                const TTtruoccuoc = UnitPriceAsNumber * QuantityAsNumber;
                return (
                  <EditableCell
                    context={context}
                    checkTotal={true}
                    valueTotal={TTtruoccuoc ? TTtruoccuoc : '0'}
                    render={() => TTtruoccuoc ? Numeral.price(TTtruoccuoc) : '0'}
                    FormTextFieldProps={{
                      InputProps: {
                        inputComponent: PriceInput,
                      },
                    }}
                  />
                );
              }}
            </ProFormDependency>
          )
        },
        meta: {
          title: HEAD_CELLS.TTtruoccuoc,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      columnHelper.display({
        id: 'TTsaucuoc',
        enableSorting: false,
        header: () => HEAD_CELLS.TTsaucuoc,
        cell: (context) => {
          const rowIndex = context.row.index;
          const unitPriceVndD = `form.${rowIndex}.unitPriceVnd`
          const rateD = 'rate'
          const requestPriceD = `form.${rowIndex}.requestPrice`
          const ratePriceD = `form.${rowIndex}.ratePrice`
          const quantityD = `form.${rowIndex}.quantity`
          
          return (
            <ProFormDependency fields={[unitPriceVndD,ratePriceD,rateD,requestPriceD,quantityD]}>
              {(values) => {
                const {[unitPriceVndD]:unitPriceVnd,[ratePriceD]:ratePrice,[rateD]:rate,[requestPriceD]: requestPrice ,[quantityD]:quantity} =
                  values;
                const UnitPriceAsNumber = unitPriceVnd ? parseFloat(unitPriceVnd) : 0;
                const rateAsNumber = rate ? parseFloat(rate) : 0 ;
                const requestPriceAsNumber = requestPrice ? parseFloat(requestPrice) : 0 ;
                const RatePriceAsNumber = ratePrice ? parseFloat(ratePrice) : 0;
                const TotalGiaNhap = (requestPriceAsNumber * rate ) + RatePriceAsNumber

                const TTsaucuoc = TotalGiaNhap * quantity;
                return (
                  <EditableCell
                    context={context}
                    checkTotal={true}
                    valueTotal={TTsaucuoc ? TTsaucuoc : '0'}
                    render={() => TTsaucuoc ? Numeral.price(TTsaucuoc) : '0'}
                    FormTextFieldProps={{
                      InputProps: {
                        inputComponent: PriceInput,
                      },
                    }}
                  />
                );
              }}
            </ProFormDependency>
          )
        },
        meta: {
          title: HEAD_CELLS.TTsaucuoc,
          align: 'center',
          editable: false,
          type: 'text',
        },
      }),
      // columnHelper.accessor('rate', {
      //   id: 'rate',
      //   size: 150,
      //   enableSorting: false,
      //   header: () => HEAD_CELLS.rate,
      //   cell: (context) => {
      //     const rowIndex = context.row.index;
      //     const requestPrice = `form.${rowIndex}.requestPrice`;
      //     const requestQuantity = `form.${rowIndex}.requestQuantity`;
      //     return (
      //       <ProFormDependency fields={[requestPrice, requestQuantity]}>
      //         {(values) => {
      //           const { [requestPrice]: price, [requestQuantity]: quantity } =
      //             values;
      //           const requestPriceAsNumber = parseFloat(price);
      //           const requestQuantityAsNumber = parseFloat(quantity);
      //           const totalCny = requestPriceAsNumber * requestQuantityAsNumber;
      //           return (
      //             <EditableCell
      //               context={context}
      //               checkTotal={true}
      //               valueTotal={totalCny}
      //               render={() => Numeral.price(totalCny)}
      //               FormTextFieldProps={{
      //                 InputProps: {
      //                   inputComponent: PriceInput,
      //                 },
      //               }}
      //             />
      //           );
      //         }}
      //       </ProFormDependency>
      //     );
      //   },
      //   footer: (context) => {
      //     const getRows = context.table.getFilteredRowModel().rows;
      //     const arrayTotal: string[] = [];
      //     if (!isEmpty(getRows)) {
      //       getRows.forEach((item: any, index: any) => {
      //         const rowIndex = index;
      //         const Total = `form.${rowIndex}.rate`;
      //         arrayTotal.push(Total);
      //       });
      //     }
      //     return (
      //       <ProFormDependency fields={arrayTotal}>
      //         {(values) => {
      //           let totalRate = 0;
      //           for (const item in values) {
      //             if (values[item]) {
      //               totalRate += values[item];
      //             }
      //           }
      //           return (
      //             <Typography
      //               fontWeight="bold"
      //               sx={{ color: '#000000', textAlign: 'right' }}
      //             >
      //               {totalRate ? Numeral.price(totalRate) : 0}
      //             </Typography>
      //           );
      //         }}
      //       </ProFormDependency>
      //     );
      //   },
      //   meta: {
      //     type: 'text',
      //     title: HEAD_CELLS.rate,
      //     align: 'center',
      //     colSpan: () => 1,
      //   },
      // }),
      // columnHelper.display({
      //   id: 'total',
      //   size: 150,
      //   enableSorting: false,
      //   header: () => HEAD_CELLS.total,
      //   cell: (context) => {
      //     const rowIndex = context.row.index;
      //     const requestPrice = `form.${rowIndex}.requestPrice`;
      //     const requestQuantity = `form.${rowIndex}.requestQuantity`;
      //     const rate = 'rate';
      //     return (
      //       <ProFormDependency fields={[requestPrice, requestQuantity, rate]}>
      //         {(values) => {
      //           const {
      //             [requestPrice]: price,
      //             [requestQuantity]: quantity,
      //             rate,
      //           } = values;
      //           const requestPriceAsNumber = parseFloat(price);
      //           const requestQuantityAsNumber = parseFloat(quantity);
      //           const rateAsNumber = parseFloat(rate);
      //           const totalVnd =
      //             requestPriceAsNumber * requestQuantityAsNumber * rateAsNumber;

      //           return (
      //             <EditableCell
      //               context={context}
      //               checkTotal={true}
      //               valueTotal={totalVnd}
      //               render={() => Numeral.price(totalVnd)}
      //               FormTextFieldProps={{
      //                 InputProps: {
      //                   inputComponent: PriceInput,
      //                 },
      //               }}
      //             />
      //           );
      //         }}
      //       </ProFormDependency>
      //     );
      //   },
      //   footer: (context) => {
      //     const getRows = context.table.getFilteredRowModel().rows;

      //     const arrayTotal: string[] = [];
      //     if (!isEmpty(getRows)) {
      //       getRows.forEach((item: any, index: any) => {
      //         const rowIndex = index;
      //         const Total = `form.${rowIndex}.total`;
      //         arrayTotal.push(Total);
      //       });
      //     }
      //     return (
      //       <ProFormDependency fields={arrayTotal}>
      //         {(values) => {
      //           let res2 = 0;
      //           for (const item in values) {
      //             if (values[item]) {
      //               res2 += values[item];
      //             }
      //           }
      //           return (
      //             <Typography
      //               fontWeight="bold"
      //               sx={{ color: '#000000', textAlign: 'right' }}
      //             >
      //               {res2 ? Numeral.price(res2) : 0}
      //             </Typography>
      //           );
      //         }}
      //       </ProFormDependency>
      //     );
      //   },
      //   meta: {
      //     type: 'text',
      //     title: HEAD_CELLS.total,
      //     align: 'center',
      //     colSpan: () => 1,
      //   },
      // }),
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
  }, [dialog,open,handleClose,onUpdate]);

  return { columns };
};

export default useTableColumns;
