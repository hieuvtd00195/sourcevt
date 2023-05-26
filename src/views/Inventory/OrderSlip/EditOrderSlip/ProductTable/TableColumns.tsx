import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, Typography } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { PriceDecimalInput, PriceInput } from 'plugins/NumberFormat';
import { useEffect, useMemo, useState } from 'react';
import Numeral from 'utils/Numeral';
import { IDataSaleOrderLines } from '../utils/types';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import Validation from 'utils/Validation';
import Regexs from 'utils/Regexs';
import { isEmpty } from 'lodash';

interface ISaleOrderLinesTable {
  id: string | null;
  ordinal: string;
  code: string;
  productId: string;
  productName: string;
  requestQuantity: string;
  importQuantity: number | null;
  requestPrice: string;
  suggestedPrice: string;
  totalPriceNDT: string;
  totalPrice: string;
  isDefault: boolean;
  actions: string;
}

const columnHelper = getColumnHelper<ISaleOrderLinesTable>();

const HEAD_CELLS: HeadCell<ISaleOrderLinesTable> = {
  ordinal: 'STT',
  code: 'ID Sản phẩm',
  productName: 'Sản phẩm',
  requestQuantity: 'SL yêu cầu',
  importQuantity: 'SL đã nhập',
  requestPrice: 'Giá yêu cầu',
  suggestedPrice: 'Giá đề xuất',
  totalPriceNDT: 'TT tệ',
  totalPrice: 'Tổng tiền VND',
  actions: 'Thao tác',
};

interface Props {
  handleDeleteRow: (index: number, value: any) => void;
  handleChangeTotal: () => void;
  saleOrderLineDefault: IDataSaleOrderLines[];
}

const useTableColumns = (props: Props) => {
  const { handleDeleteRow, handleChangeTotal, saleOrderLineDefault } = props;
  const dialog = useDialog();

  const [arrProductDefault, setArrProductDefault] = useState<string[]>([]);

  useEffect(() => {
    setArrProductDefault(saleOrderLineDefault.map((item) => item.productId));
  }, [saleOrderLineDefault]);

  const columns: ProColumn<ISaleOrderLinesTable> = useMemo(() => {
    return [
      columnHelper.accessor('ordinal', {
        id: 'ordinal',
        size: 65,
        enableSorting: false,
        header: () => 'STT',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.ordinal,
          align: 'center',
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        enableSorting: false,
        header: () => 'ID Sản phẩm',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
        },
      }),
      columnHelper.accessor('productName', {
        id: 'productName',
        enableSorting: false,
        header: () => 'Sản phẩm',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.productName,
          align: 'center',
        },
      }),
      columnHelper.accessor('requestQuantity', {
        id: 'requestQuantity',
        enableSorting: false,
        header: () => 'SL yêu cầu',
        cell: (context) => {
          const index = context.row.index;
          const importQuantity = context?.row?.original?.importQuantity ?? 0;
          const requestQuantity =
            index <= saleOrderLineDefault.length
              ? parseFloat(saleOrderLineDefault[index]?.requestQuantity ?? '')
              : 0;
          const isDefault = context?.row?.original?.isDefault;
          const checkDisabled =
            index <= saleOrderLineDefault.length
              ? importQuantity >= requestQuantity && isDefault
              : false;

          return (
            <Box>
            <ProFormTextField
              key={index}
              disabled={checkDisabled}
              name={`saleOrderLines.${index}.requestQuantity`}
              onBlur={handleChangeTotal}
              validate={
                checkDisabled
                  ? Validation.stringNotRequired()
                  : Validation.pattern(Regexs.number, 'SL yêu cầu không hợp lệ')
                      .test(
                        'valiRequestQuantity',
                        'SL yêu cầu phải lớn hơn hoặc bằng SL đã nhập',
                        async (value, context) => {
                          const numberVal = parseInt(value);
                          return !(numberVal < importQuantity);
                        }
                      )
                      .test(
                        'valiRequestQuantity',
                        'SL yêu cầu phải lớn hơn 0',
                        async (value, context) => {
                          const numberVal = parseInt(value);
                          return !(numberVal <= 0);
                        }
                      )
                      .required('SL yêu cầu không được để trống')
                      .nullable()
                      .default('')
              }
              InputProps={{
                inputComponent: PriceDecimalInput,
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '.MuiInputBase-input': { fontWeight: 700 },
                },
              }}
              InputLabelProps={{
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    fontWeight: 700,
                  },
                },
              }}
            />
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.requestQuantity,
          align: 'center',
        },
      }),
      columnHelper.accessor('importQuantity', {
        id: 'importQuantity',
        enableSorting: false,
        header: () => 'SL đã nhập',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.importQuantity,
          align: 'center',
        },
      }),
      columnHelper.accessor('requestPrice', {
        id: 'requestPrice',
        enableSorting: false,
        header: () => 'Giá yêu cầu',
        cell: (context) => {
          const index = context.row.index;
          const isID = !isEmpty(context.row.original.id);
          const productId = context.row.original.productId;
          const isDisabled = arrProductDefault.includes(productId);
          return (
            <Box>
            <ProFormTextField
              key={index}
              disabled={isDisabled && isID ? true : false}
              name={`saleOrderLines.${index}.requestPrice`}
              validate={
                isDisabled
                  ? Validation.string().nullable().notRequired().default('0')
                  : Validation.pattern(
                      Regexs.number2,
                      'Giá yêu cầu không hợp lệ'
                    )
                      .test(
                        'valiRequestPrice',
                        'Giá yêu cầu phải lớn hơn 0',
                        async (value, context) => {
                          const numberVal = parseInt(value);
                          return !(numberVal <= 0);
                        }
                      )
                      .required('Giá yêu cầu không được để trống')
                      .nullable()
                      .default('')
              }
              onBlur={handleChangeTotal}
              InputProps={{
                inputComponent: PriceDecimalInput,
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '.MuiInputBase-input': { fontWeight: 700 },
                },
              }}
              InputLabelProps={{
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    fontWeight: 700,
                  },
                },
              }}
            />
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.requestPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('suggestedPrice', {
        id: 'suggestedPrice',
        enableSorting: false,
        header: () => 'Giá đề xuất',
        cell: (context) => {
          const index = context.row.index;
          return (
            <Box>
            <ProFormTextField
              key={index}
              name={`saleOrderLines.${index}.suggestedPrice`}
              validate={Validation.pattern(
                Regexs.number2,
                'Giá đề xuất không hợp lệ'
              )
                .test(
                  'valiSuggestedPrice',
                  'Giá đề xuất phải lớn hơn 0',
                  async (value, context) => {
                    const numberVal = parseInt(value);
                    return !(numberVal <= 0);
                  }
                )
                .required('Giá đề xuất không được để trống')
                .nullable()
                .default('')}
              InputProps={{
                inputComponent: PriceDecimalInput,
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '.MuiInputBase-input': { fontWeight: 700 },
                },
              }}
              InputLabelProps={{
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    fontWeight: 700,
                  },
                },
              }}
            />
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.suggestedPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPriceNDT', {
        id: 'totalPriceNDT',
        enableSorting: false,
        header: () => 'TT tệ',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{Numeral.price(value)}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.totalPriceNDT,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        enableSorting: false,
        header: () => 'Tổng tiền VND',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{Numeral.price(value)}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.totalPrice,
          align: 'center',
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const importQuantity = context?.row?.original?.importQuantity ?? 0;
          const requestQuantity = parseFloat(
            context?.row?.original?.requestQuantity ?? '0'
          );

          return (
            <IconButton
              onClick={() =>
                handleDeleteRow(context?.row?.index, context?.row?.original)
              }
              disabled={importQuantity > 0 || importQuantity >= requestQuantity}
            >
              <CancelSharpIcon />
            </IconButton>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [dialog, handleDeleteRow]);

  return { columns };
};

export default useTableColumns;
