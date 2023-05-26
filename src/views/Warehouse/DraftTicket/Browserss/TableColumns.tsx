import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Index from 'components/ProTable/components/Index';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo, useState } from 'react';
import { IProductCreateDraftTicket } from 'types/draftTicket';
import Validation from 'utils/Validation';

const columnHelper = getColumnHelper<IProductCreateDraftTicket>();

const HEAD_CELLS: HeadCell<IProductCreateDraftTicket> = {
  index: 'ID',
  stockQuantity: 'Có thể chuyển',
  productName: 'Tên SP',
  product: 'Mã vạch SP',
  quantity: 'SL',
  IMEI: 'Lỗi (0)  ',
  price: 'Giá',
  thanhTien: 'Thành tiền',
  chietKhau: 'Chiết khấu',
  khoiLuong: 'Số lượng',
  note: 'Ghi chú',
  actions: 'Hành động',
  requestQuantity: 'Yêu cầu',
  approveQuantity: 'SL duyệt',
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
  const [quantity, setQuantity] = useState<number | null>();

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
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.product,
          editable: true,
          type: 'text',
        },
      }),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 50,
        header: () => HEAD_CELLS.productName,
        enableSorting: false,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productName,
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

      columnHelper.accessor('requestQuantity', {
        id: 'requestQuantity',
        size: 150,
        header: (context) => {
          return (
            <>
              <Typography>Yêu cầu</Typography>

              <SkipNextIcon
                sx={{ cursor: 'pointer' }}
                color="primary"
                onClick={onSetAll()}
              />
            </>
          );
        },
        enableSorting: false,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                validate: Validation.number().default(0),
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
          title: HEAD_CELLS.requestQuantity,
          align: 'center',
          editable: true,
          type: 'text',
        },
      }),

      columnHelper.accessor('approveQuantity', {
        id: 'approveQuantity',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.approveQuantity,
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
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.approveQuantity,
          editable: true,
          type: 'text',
        },
      }),

      columnHelper.accessor('note', {
        id: 'note',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => (
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
            disable
          />
        ),
        meta: {
          title: HEAD_CELLS.note,
          editable: true,
          type: 'text',
        },
      }),
    ];
  }, [onSetAll, pageNumber, pageSize, setValue]);

  return { columns };
};

export default useTableColumns;
