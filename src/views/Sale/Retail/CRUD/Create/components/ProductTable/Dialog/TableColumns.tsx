import DeleteIcon from '@mui/icons-material/Delete';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Checkbox, IconButton, TextField } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import Selection from 'components/ProTable/components/Selection';
import SelectionCheckboxWithHeader from 'components/ProTable/components/SelectionCheckboxWithHeader';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  productId: 'ID',
  productName: 'Sản phẩm',
  quantity: 'SL',
  price: 'Giá tiền',
  isDebt: 'Nợ',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  onDelete: (rowIndex: number, rowId: string) => () => void;
}

const useTableColumns = (props: Props) => {
  const { onDelete } = props;
  const dialog = useDialog();
  const columns: ProColumn<any> = useMemo(() => {
    return [
      SelectionCheckboxWithHeader<any>("Nợ"),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 30,
        header: () => HEAD_CELLS.productName,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productName,
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 100,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.quantity,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 100,
        header: () => HEAD_CELLS.price,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.price,
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
            <IconButton>
              <DeleteIcon sx={{ color: 'text.secondary', ml: 1 }} onClick={() => handleDeleteRow() }/>
            </IconButton>
          )
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
