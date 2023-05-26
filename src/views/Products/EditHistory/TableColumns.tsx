import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Link } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import DateFns from 'utils/DateFns';
import { IProductModificationHistory } from './utils/type';

const columnHelper = getColumnHelper<IProductModificationHistory>();

const HEAD_CELLS: HeadCell<IProductModificationHistory> = {
  productCode: 'Mã sản phẩm',
  productName: 'Tên sản phẩm',
  logType: 'Kiểu Log',
  modifier: 'Người Sửa',
  time: 'Thời gian',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleToggleDialog: () => void;
}

const useTableColumns = (props: Props) => {
  const { handleToggleDialog } = props;

  const columns: ProColumn<IProductModificationHistory> = useMemo(() => {
    return [
      Selection<IProductModificationHistory>(),

      columnHelper.accessor('productCode', {
        id: 'productCode',
        header: () => HEAD_CELLS.productCode,
        cell: (context) => context.getValue(),
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.productCode,
        },
      }),
      columnHelper.accessor('productName', {
        id: 'productName',
        header: () => HEAD_CELLS.productName,
        cell: (context) => (
          <Box>
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          </Box>
        ),
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.productName,
        },
      }),
      columnHelper.accessor('logType', {
        id: 'logType',
        header: () => HEAD_CELLS.logType,
        cell: (context) => context.getValue(),
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.logType,
        },
      }),
      columnHelper.accessor('modifier', {
        id: 'modifier',
        header: () => HEAD_CELLS.modifier,
        cell: (context) => context.getValue(),
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.modifier,
        },
      }),
      columnHelper.accessor('time', {
        id: 'time',
        header: () => HEAD_CELLS.time,
        cell: (context) => DateFns.Format(context.getValue(), 'HH:mm dd/MM'),
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.time,
        },
      }),
      {
        id: 'actions',
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <ActionIconButton actionType="more" onClick={handleToggleDialog} />
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [handleToggleDialog]);

  return { columns };
};

export default useTableColumns;
