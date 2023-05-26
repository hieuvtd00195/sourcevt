import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProductPortfolioTable } from 'types/category';

const columnHelper = getColumnHelper<IProductPortfolioTable>();

const HEAD_CELLS: HeadCell<IProductPortfolioTable> = {
  index: 'ID',
  ttbh: 'Thông tin BH',
  code: 'Mã',
  name: 'Tên',
  status: 'Trạng thái',
  order: 'Thứ tự',
  total: 'Số SP',
  person: 'Người phụ trách',
  tyLe: 'Tỷ lệ',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const navigate = useNavigate();
  const columns: ProColumn<IProductPortfolioTable> = useMemo(() => {
    return [
      Selection<IProductPortfolioTable>(),
      Index<IProductPortfolioTable>(pageNumber, pageSize),

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
      columnHelper.accessor('ttbh', {
        id: 'ttbh',
        size: 200,
        enableSorting: false,
        header: () => HEAD_CELLS.ttbh,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.ttbh,
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.status,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.status,
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
      columnHelper.accessor('person', {
        id: 'person',
        size: 100,
        header: () => HEAD_CELLS.person,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.person,
        },
      }),
      columnHelper.accessor('tyLe', {
        id: 'tyLe',
        size: 100,
        header: () => HEAD_CELLS.tyLe,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.tyLe,
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
                  onSelect: () => navigate('/category/edit'),
                },
                {
                  label: 'Thêm danh mục con',
                  value: 2,
                  actionType: 'add',
                },
                {
                  label: 'Up ảnh',
                  value: 3,
                  actionType: 'add',
                },
                {
                  label: 'Up icon',
                  value: 4,
                  actionType: 'add',
                },
                {
                  label: 'Chuyển sản phẩm sang danh mục khác',
                  value: 5,
                  actionType: 'arrowRight',
                },
                {
                  label: 'Link trên website',
                  value: 6,
                  actionType: 'link',
                },
                {
                  label: 'Gỡ sản phẩm thuộc danh mục',
                  value: 7,
                  actionType: 'remove',
                },
                {
                  label: 'Xóa ảnh',
                  value: 8,
                  actionType: 'delete',
                },
                {
                  label: 'Xóa Icon',
                  value: 9,
                  actionType: 'delete',
                },
                {
                  label: 'Xóa danh mục',
                  value: 10,
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
  }, [pageNumber, pageSize, navigate]);

  return { columns };
};

export default useTableColumns;
