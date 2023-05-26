import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { TKKT } from './utils/types';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  index: 'ID',
  code: 'Code',
  name: 'Tên',
  storeName: 'Cửa hàng',
  isActive: 'Tình trạng',
  creatorName: 'Người tạo',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const dialog = useDialog();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      Index<TKKT>(pageNumber, pageSize),
      columnHelper.group({
        id: 'order',
        header: '',
        columns: [
          columnHelper.accessor('code', {
            id: 'code',
            size: 250,
            header: () => HEAD_CELLS.code,
            cell: (context) => {
              const { level, code } = context.row.original;
              return level === 1 ? (
                <Typography sx={{ marginLeft: '12px' }}>{code}</Typography>
              ) : level === 2 ? (
                <Typography sx={{ marginLeft: '24px' }}>{code}</Typography>
              ) : level === 3 ? (
                <Typography sx={{ marginLeft: '48px' }}>{code}</Typography>
              ) : (
                <Typography sx={{ marginLeft: '96px' }}>{code}</Typography>
              );
            },

            meta: {
              title: HEAD_CELLS.code,
            },
          }),
          columnHelper.accessor('name', {
            id: 'name',
            size: 250,
            header: () => HEAD_CELLS.name,
            cell: (context) => {
              const { level, name } = context.row.original;
              return level === 1 ? (
                <Typography sx={{ marginLeft: '12px' }}>{name}</Typography>
              ) : level === 2 ? (
                <Typography sx={{ marginLeft: '24px' }}>{name}</Typography>
              ) : level === 3 ? (
                <Typography sx={{ marginLeft: '48px' }}>{name}</Typography>
              ) : (
                <Typography sx={{ marginLeft: '96px' }}>{name}</Typography>
              );
            },
            meta: {
              title: HEAD_CELLS.name,
            },
          }),
          columnHelper.accessor('storeName', {
            id: 'storeName',
            size: 160,
            header: () => HEAD_CELLS.storeName,
            cell: (context) => <Typography>{context.getValue()}</Typography>,
            meta: {
              title: HEAD_CELLS.storeName,
            },
          }),
          columnHelper.accessor('isActive', {
            id: 'isActive',
            size: 60,
            header: () => HEAD_CELLS.isActive,
            cell: (context) => {
              const { isActive } = context.row.original;
              return (
                <Typography sx={{ justifyContent: 'center' }}>
                  {isActive && <CheckIcon />}
                </Typography>
              );
            },

            meta: {
              title: HEAD_CELLS.isActive,
            },
          }),

          columnHelper.accessor('creatorName', {
            id: 'creatorName',
            size: 160,
            header: () => HEAD_CELLS.creatorName,
            cell: (context) => <Typography>{context.getValue()}</Typography>,
            meta: {
              title: HEAD_CELLS.creatorName,
            },
          }),
        ],

        meta: {
          align: 'center',
        },
      }),

        {
          id: 'actions',
          size: 65,
          enableSorting: false,
          header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
          cell: (context) => {
            const handleDeleteRow = () => {
              dialog({
                headline: 'Xác nhận xóa?',
                supportingText: (
                  <Fragment>
                    Bạn có chắc chắn muốn xóa:{' '}
                    <strong>{context.row.original.name}</strong>
                  </Fragment>
                ),
                onConfirm: async () => {},
              });
            };

            return (
              <ProMenu
                position="left"
                items={[
                  {
                    label: 'Thêm tài khoản',
                    value: 1,
                    actionType: 'add',
                  },
                  {
                    label: 'Sửa',
                    value: 2,
                    actionType: 'edit',
                  },
                  {
                    label: 'Xóa',
                    value: 3,
                    actionType: 'delete',
                    onSelect: handleDeleteRow,
                  },
                ]}
              >
                <ActionIconButton actionType="action" />
              </ProMenu>
            );
          },
          meta: {
            title: HEAD_CELLS.actions,
            align: 'center',
          },
        },
    ];
  }, [pageNumber, pageSize, dialog]);

  return { columns };
};

export default useTableColumns;
