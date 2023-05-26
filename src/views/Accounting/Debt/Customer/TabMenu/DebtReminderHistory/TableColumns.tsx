import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IDebtReminderLog } from 'types/debtReminderLog';
import DateTime from 'utils/DateTime';
import DateFns from 'utils/DateFns';

const columnHelper = getColumnHelper<IDebtReminderLog>();

const HEAD_CELLS: HeadCell<IDebtReminderLog> = {
  code: 'ID',
  payDate: 'Ngày nhắc nợ',
  customerName: 'Tên khách hàng',
  content: 'Nội dung',
  handlerStoreNames: 'Cửa hàng phụ trách',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleClickShowPopup: () => void;
}
const useTableColumns = (props: Props) => {
  const columns: ProColumn<IDebtReminderLog> = useMemo(() => {
    return [
      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
        },
      }),
      columnHelper.accessor('payDate', {
        id: 'payDate',
        size: 400,
        enableSorting: false,
        header: () => HEAD_CELLS.payDate,
        cell: (context) => {
          const { createName } = context.row.original;

          return (
            <div>
              {createName} <br />
              {DateFns.convertUTCDateToLocalDate(
                context.getValue()
                // , 'DD/MM/YYYY'
              )}
            </div>
          );
        },
        meta: {
          title: HEAD_CELLS.payDate,
          align: 'center',
        },
      }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        size: 400,
        enableSorting: false,
        header: () => HEAD_CELLS.customerName,
        cell: (context) => {
          const { customerPhone } = context.row.original;

          return (
            <div>
              {context.getValue()} <br />
              {customerPhone}
            </div>
          );
        },
        meta: {
          title: HEAD_CELLS.customerName,
          align: 'center',
        },
      }),
      columnHelper.accessor('content', {
        id: 'content',
        size: 400,
        enableSorting: false,
        header: () => HEAD_CELLS.content,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.content,
          align: 'center',
        },
      }),
      columnHelper.accessor('handlerStoreNames', {
        id: 'handlerStoreNames',
        size: 400,
        enableSorting: false,
        header: () => HEAD_CELLS.handlerStoreNames,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.handlerStoreNames,
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
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa',
                  value: 1,
                  actionType: 'edit',
                },
                {
                  label: 'Xóa',
                  value: 2,
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
