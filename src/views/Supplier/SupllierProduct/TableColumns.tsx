import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Link } from '@mui/material';
import { SupplierProduct } from './utils/type';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import useDialog from 'hooks/useDialog';

const columnHelper = getColumnHelper<SupplierProduct>();

const HEAD_CELLS: HeadCell<SupplierProduct> = {
  index: 'STT',
  supplier: 'Nhà cung cấp',
  productCode: 'Mã SP',
  barCode: 'Mã vạch',
  productName: 'Tên SP',
  package: 'Lô hàng',
  codeNCC: 'Mã NCC',
  codeProductNCC: 'Mã sản phẩm',
  action: 'Hành động',
};

interface Props {}

const useTableColumns = (props: Props) => {
  const dialog = useDialog();
  const columns: ProColumn<SupplierProduct> = useMemo(() => {
    return [
      Selection<SupplierProduct>(),

      columnHelper.accessor('supplier', {
        id: 'supplier',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.supplier,
        cell: (context) => {
          return (
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.supplier,
        },
      }),
      columnHelper.accessor('productCode', {
        id: 'productCode',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.productCode,
        cell: (context) => {
          return (
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.productCode,
        },
      }),
      columnHelper.accessor('barCode', {
        id: 'barCode',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.barCode,
        cell: (context) => {
          return (
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.barCode,
        },
      }),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.productName,
        cell: (context) => {
          return (
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.productName,
        },
      }),
      columnHelper.accessor('package', {
        id: 'package',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.package,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.package,
        },
      }),
      columnHelper.accessor('codeNCC', {
        id: 'codeNCC',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.codeNCC,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.codeNCC,
        },
      }),
      columnHelper.accessor('codeProductNCC', {
        id: 'codeProductNCC',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.codeProductNCC,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.codeProductNCC,
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
