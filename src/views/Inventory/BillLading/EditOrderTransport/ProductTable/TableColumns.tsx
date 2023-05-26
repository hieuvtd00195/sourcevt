import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, Typography } from '@mui/material';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { PriceDecimalInput, PriceInput } from 'plugins/NumberFormat';
import { useEffect, useMemo, useState } from 'react';
import Numeral from 'utils/Numeral';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import Validation from 'utils/Validation';
import Regexs from 'utils/Regexs';
import { isEmpty } from 'lodash';

interface ITable {
  id: string | null;
  ordinal: string;
  code: string;
  supplierName: string;
  invoiceNumber: string;
}

const columnHelper = getColumnHelper<ITable>();

const HEAD_CELLS: HeadCell<ITable> = {
  ordinal: 'STT',
  code: 'ID',
  supplierName: 'Nhà cung cấp',
  invoiceNumber: 'Hóa đơn',
  actions: 'Thao tác',
};

interface Props {
  handleDeleteRow: (index: number, value: any) => void;
}

const useTableColumns = (props: Props) => {
  const { handleDeleteRow } = props;
  const dialog = useDialog();

  const columns: ProColumn<ITable> = useMemo(() => {
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
        header: () => 'ID',
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
      columnHelper.accessor('supplierName', {
        id: 'supplierName',
        enableSorting: false,
        header: () => 'Nhà cung cấp',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.supplierName,
          align: 'center',
        },
      }),
      columnHelper.accessor('invoiceNumber', {
        id: 'invoiceNumber',
        enableSorting: false,
        header: () => 'Hóa đơn',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.invoiceNumber,
          align: 'center',
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <IconButton
              onClick={() =>
                handleDeleteRow(context?.row?.index, context?.row?.original)
              }
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
