import ImageIcon from '@mui/icons-material/Image';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SouthIcon from '@mui/icons-material/South';
import { Box, Grid, MenuItem, Select, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Selection from 'components/ProTable/components/Selection';
import EditableCell from 'components/ProTable/core/EditableCell';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { PriceDecimalInput, PriceInput, SaleInput } from 'plugins/NumberFormat';
import { Fragment, useMemo } from 'react';
import Numeral from 'utils/Numeral';
import Validation from 'utils/Validation';

export interface ISubComponent {
  [key: string]: any;
}

const columnHelper = getColumnHelper<ISubComponent>();

const HEAD_CELLS: HeadCell<ISubComponent> = {
  index: 'ID',
  id: 'productId',
  productName: 'Sản phẩm',
  productId: 'Mã sản phẩm',
  quantity: 'SL',
  inventory: 'Tồn có thể bán',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
  onAddChildProduct: (id: string, name: string) => void;
}

const useTableSubColumns = (props: Props) => {
  const { handleOpenDialog } = props;

  const subColumns: ProColumn<ISubComponent> = useMemo(() => {
    return [
      Selection<ISubComponent>(),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 30,
        header: () => HEAD_CELLS.productName,
        cell: ({ getValue }) => getValue(),
        meta: {
          title: HEAD_CELLS.productName,
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 50,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => (
          <EditableCell
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
    ];
  }, [handleOpenDialog]);

  return { subColumns };
};

export default useTableSubColumns;
