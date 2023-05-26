import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Validation from 'utils/Validation';
import Index from 'components/ProTable/components/Index';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo, useState } from 'react';
import { IImportExport } from './utils/types';
import Regexs from 'utils/Regexs';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import * as yup from 'yup';
import { PriceInput } from 'plugins/NumberFormat';


const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  index: 'ID',
  barCode: 'Mã vạch SP',
  stockQuantity: 'Có thể chuyển',
  name: 'Tên SP',
  quantity: 'SL',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  onDelete: (rowIndex: number, rowId: string) => () => void;
  handleBlur: (e: any) => void;
  onSetAll: () => () => Promise<void>;
  setValue: any;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, onDelete, handleBlur, setValue, onSetAll } = props;
  const [checkNote, setCheckNote] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<number | null>();

  const columns: ProColumn<IImportExport> = useMemo(() => {
    return [
      Index<IImportExport>(pageNumber, pageSize),

      columnHelper.accessor('barCode', {
        id: 'barCode',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.barCode,
        cell: (context) => {
          const rowIndex = context.row.index;
          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="body2">
                {context.row.original.code}
              </Typography>
              {/* {checkNote.includes(rowIndex) ? (
                <TextField
                  placeholder="Ghi chú"
                  size="small"
                  onChange={(e) => { setValue(`form.${rowIndex}.note`, e.target.value) }}
                />
              ) : null} */}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.barCode,
          align: 'center',
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 50,
        header: () => HEAD_CELLS.name,
        enableSorting: false,
        cell: (context) => {
          // context.getValue(),
          const rowIndex = context.row.index;
          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="body2">
                {context.row.original.name}
              </Typography>
              {checkNote.includes(rowIndex) ? (
                <TextField
                  placeholder="Ghi chú"
                  size="small"
                  onChange={(e) => { setValue(`form.${rowIndex}.note`, e.target.value) }}
                />
              ) : null}
            </Stack>
          )
        },
        meta: {
          title: HEAD_CELLS.name,
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
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 150,
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
        enableSorting: false,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                validate:
                  Validation.number() // Validates for numerical value
                    .positive("Số lượng phải là số nguyên dương và lớn hơn 0") // Validates against negative values
                    .required("Số lượng không được để trống") // Sets it as a compulsory field
                    .max(context.row.getValue('stockQuantity'), "Vui lòng nhập lại số lượng trong giới hạn cho phép.")
                    .typeError("Số lượng là số nguyên dương, không bao gồm ký tự đặc biệt hoặc chữ cái")
                    .integer("Số lượng phải là số nguyên dương")
                    .default(0)
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

      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const rowIndex = context.row.index;

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
                  onSelect: onDelete(context.row.index, context.row.original.id)
                }
              ]
              }
            >
              <ActionIconButton actionType="action" />
            </ProMenu >
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [pageNumber, pageSize, checkNote, onDelete]);

  return { columns };
};

export default useTableColumns;
