import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Debt } from '../../utils/type';
import DateTime from 'utils/DateTime';

const columnHelper = getColumnHelper<Debt>();

const HEAD_CELLS: HeadCell<Debt> = {
  index: 'STT',
  customerName: 'Khách hàng [1]',
  debtReminderDate: 'Ngày nhắc nợ [2]',
  lastOrderDate: 'Ngày đơn hàng gần nhất',
  latestDebtCollectionDate: 'Ngày thu gần nhất',
  // Số dư đầu kỳ
  beginCredit: 'Phải trả [Có] [4]',
  beginDebt: 'Phải thu [Nợ] [3]',
  // Phát sinh giữa kỳ
  credit: 'Phải trả [Có] [6]',
  debt: 'Phải thu [Nợ] [5]',
  // Số dư cuối kỳ
  endCredit: 'Phải trả [Có] = 4+6-3-5',
  endDebt: 'Phải thu [Nợ] = 3+5-4-6',
  debtLimit: 'Giới hạn',
};

interface Props {
  pageIndex: number;
  pageSize: number;
  handleClickShowPopup: () => void;
}
const useTableColumns = (props: Props) => {
  const { pageIndex, pageSize, handleClickShowPopup } = props;

  const columns: ProColumn<Debt> = useMemo(() => {
    return [
      Index<Debt>(pageIndex, pageSize),
      columnHelper.group({
        id: 'objects',
        header: 'Đối tượng',
        columns: [
          columnHelper.accessor('customerName', {
            id: 'customerName',
            size: 120,
            enableSorting: false,
            header: () => 'Khách hàng [1]',
            cell: (context) => context.getValue(),
            meta: {
              title: HEAD_CELLS.customerName,
              align: 'center',
            },
          }),
          columnHelper.accessor('debtReminderDate', {
            id: 'debtReminderDate',
            size: 120,
            enableSorting: false,
            header: () => 'Ngày nhắc nợ [2]',
            cell: (context) => (
              <Tooltip title="Lịch sử nhắc nợ">
                <IconButton onClick={handleClickShowPopup}>
                  <AddCircleIcon
                    color="success"
                    sx={{ '&:hover': { cursor: 'pointer' } }}
                  />
                </IconButton>
              </Tooltip>
            ),
            meta: {
              title: HEAD_CELLS.debtReminderDate,
              align: 'center',
            },
          }),
          columnHelper.accessor('lastOrderDate', {
            id: 'lastOrderDate',
            size: 150,
            enableSorting: false,
            header: () => 'Ngày đơn hàng gần nhất',
            cell: (context) => {
              const value = context.getValue();
              return (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>
                    {DateTime.Format(value, 'DD-MM-YYYY')}{' '}
                  </Typography>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.lastOrderDate,
              align: 'center',
            },
          }),
          columnHelper.accessor('latestDebtCollectionDate', {
            id: 'latestDebtCollectionDate',
            size: 150,
            enableSorting: false,
            header: () => 'Ngày thu gần nhất',
            cell: (context) => {
              const value = context.getValue();
              return (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>
                    {DateTime.Format(value, 'DD-MM-YYYY')}{' '}
                  </Typography>
                </Box>
              );
            },
            meta: {
              title: HEAD_CELLS.latestDebtCollectionDate,
              align: 'center',
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'openingBalance',
        header: 'Số dư đầu kỳ',
        columns: [
          columnHelper.accessor('beginDebt', {
            id: 'beginDebt',
            size: 150,
            enableSorting: false,
            header: () => 'Phải thu [Nợ] [3]',
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.beginDebt,
              align: 'center',
            },
          }),
          columnHelper.accessor('beginCredit', {
            id: 'beginCredit',
            size: 150,
            enableSorting: false,
            header: () => 'Phải trả [Có] [4]',
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.beginCredit,
              align: 'center',
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'arising',
        header: 'Phát sinh giữa kỳ',
        columns: [
          columnHelper.accessor('debt', {
            id: 'debt',
            size: 150,
            enableSorting: false,
            header: () => 'Phải thu [Nợ] [5]',
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.debt,
              align: 'center',
            },
          }),
          columnHelper.accessor('credit', {
            id: 'credit',
            size: 150,
            enableSorting: false,
            header: () => 'Phải trả [Có] [6]',
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.credit,
              align: 'center',
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'endingBalance',
        header: 'Số dư cuối kỳ',
        columns: [
          columnHelper.accessor('endDebt', {
            id: 'endDebt',
            size: 150,
            enableSorting: false,
            header: () => 'Phải thu [Nợ] = 3+5-4-6',
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.endDebt,
              align: 'center',
            },
          }),
          columnHelper.accessor('endCredit', {
            id: 'endCredit',
            size: 150,
            enableSorting: false,
            header: () => 'Phải trả [Có] = 4+6-3-5',
            cell: (context) =>
              context.getValue()?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              }),
            meta: {
              title: HEAD_CELLS.endCredit,
              align: 'center',
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('debtLimit', {
        id: 'debtLimit',
        size: 180,
        enableSorting: false,
        header: () => 'Giới hạn',
        cell: (context) =>
          context.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          }),
        meta: {
          title: HEAD_CELLS.debtLimit,
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
                  label: 'Lập phiếu thu',
                  value: 2,
                  actionType: 'add',
                },
                {
                  label: 'In chi tiết khách hàng',
                  value: 3,
                  actionType: 'print',
                },
                {
                  label: 'Cập nhật khách hàng',
                  value: 4,
                  actionType: 'edit',
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
  }, [pageIndex, pageSize, handleClickShowPopup]);
  return { columns };
};

export default useTableColumns;
