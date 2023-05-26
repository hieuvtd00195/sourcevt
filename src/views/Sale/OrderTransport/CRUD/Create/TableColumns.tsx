import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import React, { useMemo } from 'react';
import { TableCreateOrder } from './utils/type';
import { ProColumn } from 'components/ProTable/types';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
interface Props {
  pageNumber: number;
  pageSize: number;
  handleDeleteField: (id: number) => void;
}

const columnHelper = getColumnHelper<TableCreateOrder>();

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, handleDeleteField } = props;

  const columns: ProColumn<TableCreateOrder> = useMemo(() => {
    return [
      columnHelper.accessor('orderId', {
        id: 'orderId',
        enableSorting: false,
        size: 125,
        header: () => 'ID',
        cell: (context) => {
          return context.row.original.orderId;
        },
        meta: {
          title: 'ID',
          align: 'center',
          editable: true,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        enableSorting: false,
        size: 125,
        header: () => 'Tên khách hàng',
        cell: (context) => {
          return context.row.original.customerName;
        },
        meta: {
          title: 'Tên khách hàng',
          align: 'center',
          editable: true,
          colSpan: () => null,
        },
      }),
      {
        id: 'actions',
        size: 50,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <div onClick={() => handleDeleteField(context.row.index)}>
              <DeleteIcon color="primary" sx={{ cursor: 'pointer' }} />
            </div>
          );
        },
        meta: {
          title: 'Hành động',
          align: 'center',
          colSpan: () => null,
        },
      },
    ];
  }, [pageNumber, pageSize]);

  return { columns };
};

export default useTableColumns;
