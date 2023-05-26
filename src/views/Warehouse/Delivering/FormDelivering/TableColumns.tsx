import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { PriceInput } from 'plugins/NumberFormat';
import { useMemo, useState } from 'react';
import { IProductCreateDraftTicket } from 'types/draftTicket';
import Validation from 'utils/Validation';
import { useNavigate, useParams } from 'react-router-dom';

const columnHelper = getColumnHelper<IProductCreateDraftTicket>();

const HEAD_CELLS: HeadCell<IProductCreateDraftTicket> = {
  index: 'ID',
  stockQuantity: 'Có thể chuyển',
  unit: 'Tên sản phẩm',
  product: 'Mã vạch sản phẩm',
  quantity: 'SL',
  IMEI: 'Lỗi (0)  ',
  price: 'Giá',
  thanhTien: 'Thành tiền',
  chietKhau: 'Chiết khấu',
  khoiLuong: 'Số lượng',
  actions: 'Hành động',
  note: 'Ghi chú',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  setValue: any;
  onSetAll: () => () => Promise<void>;
  handleDelete: (rowIndex: number) => void;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, setValue, onSetAll, handleDelete } = props;

  const { id } = useParams();
  const [checkNote, setCheckNote] = useState<number[]>([]);

  const columns: ProColumn<IProductCreateDraftTicket> = useMemo(() => {
    return [
      Index<IProductCreateDraftTicket>(pageNumber, pageSize),

      columnHelper.accessor('note', {
        id: 'note',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.product,
        cell: (context) => {
          const rowIndex = context.row.index;
          const { barCode, code } = context.row.original;

          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="body2">{code}</Typography>
              {barCode && <Typography variant="body2">{barCode}</Typography>}
              {checkNote.includes(rowIndex) ? (
                <EditableCell
                  context={context}
                  FormTextFieldProps={{
                    placeholder: 'Ghi chú',
                    InputProps: {
                      sx: {
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000',
                        },
                        '.MuiInputBase-input': { fontWeight: 700 },
                      },
                    },
                  }}
                />
              ) : null}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.product,
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('name', {
        id: 'unit',
        size: 50,
        header: () => HEAD_CELLS.unit,
        enableSorting: false,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.unit,
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
          if (Boolean(id)) {
            return 'SL';
          }

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
              <ActionIconButton actionType="arrowDown" onClick={onSetAll()} />
            </>
          );
        },
        enableSorting: false,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                validate: Validation.number() // Validates for numerical value
                  .positive('Số lượng phải là giá trị dương') // Validates against negative values
                  .required('Số lượng không được để trống') // Sets it as a compulsory field
                  .max(
                    context.row.getValue('stockQuantity'),
                    'Vui lòng nhập lại số lượng trong giới hạn cho phép.'
                  )
                  .typeError('Số lượng không hợp lệ')
                  .default(0),
                InputProps: {
                  sx: {
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '.MuiInputBase-input': { fontWeight: 700 },
                  },
                },
              }}
              disable
            />
          );
        },
        meta: {
          title: HEAD_CELLS.quantity,
          align: Boolean(id) ? 'left' : 'center',
          editable: true,
          type: 'text',
        },
      }),

      columnHelper.accessor('note', {
        id: 'note',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.note,
          editable: true,
          type: 'text',
        },
      }),

      // {
      //   id: 'actions',
      //   size: 65,
      //   enableSorting: false,
      //   header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
      //   cell: (context) => {
      //     const rowIndex = context.row.index;
      //     return (
      //       <ProMenu
      //         position="left"
      //         items={[
      //           {
      //             label: 'Hiện ô nhập ghi chú',
      //             value: 1,
      //             actionType: 'description',
      //             onSelect: () => {
      //               setCheckNote((prev) => [...prev, rowIndex]);
      //             },
      //           },
      //           {
      //             label: 'Xóa sản phẩm',
      //             value: 2,
      //             actionType: 'delete',
      //             onSelect: () => {
      //               handleDelete(rowIndex);
      //             },
      //           },
      //         ]}
      //       >
      //         <ActionIconButton actionType="action" />
      //       </ProMenu>
      //     );
      //   },
      //   meta: {
      //     title: HEAD_CELLS.actions,
      //     align: 'center',
      //   },
      // },
    ];
  }, [pageNumber, pageSize, checkNote, onSetAll, setValue, handleDelete]);

  return { columns };
};

export default useTableColumns;
