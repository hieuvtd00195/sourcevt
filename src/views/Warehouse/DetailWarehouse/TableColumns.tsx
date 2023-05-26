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
import { isEmpty } from 'lodash';


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
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

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
          const { note } = context.row.original;
          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="body2">
                {context.row.original.code}
              </Typography>
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
          const { note } = context.row.original;
          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="body2">
                {context.row.original.name}
              </Typography>
              {!isEmpty(note) &&
                <ProFormTextField
                  name="barCodeNote"
                  placeholder="Ghi chú"
                  value={note}
                  disabled
                />
              }
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 150,
        header: () => HEAD_CELLS.quantity,
        enableSorting: false,
        cell: (context) => {
          return (
            <EditableCell
              context={context}
              FormTextFieldProps={{
                validate: Validation.pattern(
                  Regexs.number,
                  'Số lượng phải là số nguyên dương'
                )
                  .required('Số lượng không được để trống'),
                  InputProps:{
                    sx: {
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000',
                      },
                      '.MuiInputBase-input': { fontWeight: 700 },
                    },
                  }
              }}
              disable
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
                },
                {
                  label: 'Xóa sản phẩm',
                  value: 2,
                  actionType: 'delete',
                }
              ]
              }
            >
              <ActionIconButton actionType="action" disabled />
            </ProMenu >
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
