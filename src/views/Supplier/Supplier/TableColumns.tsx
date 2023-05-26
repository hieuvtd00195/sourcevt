import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Link, Tooltip } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import useDialog from 'hooks/useDialog';
import { Supplier } from './utils/type';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const columnHelper = getColumnHelper<Supplier>();

const HEAD_CELLS: HeadCell<Supplier> = {
  index: 'STT',
  code: 'Mã',
  name: 'Tên',
  type: 'Loại',
  phone: 'Điện thoại',
  creator: 'Người tạo',
  status: 'Trạng thái',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const dialog = useDialog();
  const columns: ProColumn<Supplier> = useMemo(() => {
    return [
      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.name,
        cell: (context) => {
          return (
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {`${context.getValue()}`}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.name,
        },
      }),

      columnHelper.accessor('type', {
        id: 'type',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.type,
        cell: (context) => {
          if (!context.getValue()) return;
          return context.getValue() === 1 ? 'Cá nhân' : 'Doanh Nghiệp';
        },
        meta: {
          title: HEAD_CELLS.type,
        },
      }),
      columnHelper.accessor('phone', {
        id: 'phone',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.phone,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.phone,
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.creator,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.creator,
        },
      }),

      columnHelper.accessor('status', {
        id: 'status',
        size: 50,
        enableSorting: false,
        header: () => (
          <Tooltip title="Trạng thái" placement="top">
            <DoneIcon sx={{ color: 'text.secondary' }} />
          </Tooltip>
        ),
        cell: (context) => {
          if (!context.getValue()) return;
          return context.getValue() === 1 ? (
            <Tooltip title="Đang giao dịch" placement="top">
              <DoneIcon sx={{ color: 'green' }} />
            </Tooltip>
          ) : (
            <Tooltip title="Ngừng giao dịch" placement="top">
              <CloseIcon sx={{ color: 'red' }} />
            </Tooltip>
          );
        },
        meta: {
          title: HEAD_CELLS.file,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const handleDelete = () => {
            dialog({
              supportingText: 'Bạn có chắc chắn muốn xóa đơn hàng này không?',
              // onConfirm: ,
            });
          };
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
                  onSelect: handleDelete,
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
  }, [dialog]);

  return { columns };
};

export default useTableColumns;
