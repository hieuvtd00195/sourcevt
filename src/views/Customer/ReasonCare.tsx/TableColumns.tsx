import { Typography } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IFormCareType } from './utils/type';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const columnHelper = getColumnHelper<IFormCareType>();

interface Props {
  pageNumber: number;
  pageSize: number;
}

const HEAD_CELLS: HeadCell<IFormCareType> = {
  id: 'ID',
  formality: 'Hình thức',
  name: 'Tên',
  creator: 'Người tạo',
  createTime: 'Thời gian tạo',
};

const useTableColumns = (props: Props) => {
  const columns: ProColumn<IFormCareType> = useMemo(() => {
    return [
      columnHelper.accessor('id', {
        id: 'id',
        size: 60,
        header: () => HEAD_CELLS.id,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('formality', {
        id: 'formality',
        size: 100,
        header: () => HEAD_CELLS.formality,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.formality,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 150,
        header: () => HEAD_CELLS.name,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 80,
        header: () => HEAD_CELLS.creator,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.creator,
        },
      }),
      columnHelper.accessor('createTime', {
        id: 'createTime',
        size: 80,
        header: () => HEAD_CELLS.createTime,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.createTime,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa',
                  value: 2,
                  actionType: 'edit',
                },
                {
                  label: 'Xóa',
                  value: 3,
                  actionType: 'delete',
                },
              ]}
            >
              <ActionIconButton actionType="more" />
            </ProMenu>
          );
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
