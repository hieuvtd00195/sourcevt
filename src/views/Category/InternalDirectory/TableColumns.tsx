import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IInternalDirectoryTable } from 'types/category';

const columnHelper = getColumnHelper<IInternalDirectoryTable>();

const HEAD_CELLS: HeadCell<IInternalDirectoryTable> = {
  index: 'ID',
  id: 'ID',
  imageUrl: 'Ảnh',
  iconUrl: 'Icon',
  code: 'Mã danh mục',
  name: 'Tên',
  parentId: 'parentId',
  total: 'Tổng số SP',
  creator: 'Người tạo',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const columns: ProColumn<IInternalDirectoryTable> = useMemo(() => {
    return [
      Selection<IInternalDirectoryTable>(),
      Index<IInternalDirectoryTable>(pageNumber, pageSize),

      columnHelper.accessor('id', {
        id: 'id',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.id,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 250,
        header: () => HEAD_CELLS.name,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        header: () => HEAD_CELLS.code,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('parentId', {
        id: 'parentId',
        size: 100,
        header: () => HEAD_CELLS.parentId,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.parentId,
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        size: 100,
        header: () => HEAD_CELLS.total,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.total,
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 100,
        header: () => HEAD_CELLS.creator,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.creator,
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
                  label: 'Sửa danh mục',
                  value: 1,
                  actionType: 'edit',
                },
                {
                  label: 'Thêm danh mục con',
                  value: 2,
                  actionType: 'add',
                },
                {
                  label: 'Chuyển sản phẩm sang danh mục khác',
                  value: 3,
                  actionType: 'arrowRight',
                },
                {
                  label: 'Xóa danh mục',
                  value: 4,
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
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
