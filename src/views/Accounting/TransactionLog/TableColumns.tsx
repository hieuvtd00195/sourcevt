import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import { TransactionHistory } from './utils/type';
import Selection from 'components/ProTable/components/Selection';
import { Box } from '@mui/system';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Stack, Link, Table, Typography } from '@mui/material';
import DetailLogTable from './DetailLogTable';

const HEAD_CELLS: HeadCell<TransactionHistory> = {
  index: 'STT',
  id: 'ID',
  transactionCode: 'ID giao dịch',
  transactionDate: 'Ngày giao dịch',
  // documentType: 'Loại chứng từ',
  documentCode: 'Chứng từ',
  ticketType: 'Loại giao dịch',
  totalTransactionMoney: 'Tổng tiền giao dịch',
  userAction: 'Người thao tác',
  action: 'Hành động',
  actions: 'Dữ liệu',
};

const CaseTicketType = (value: number) => {
  switch (value) {
    case 0:
      return <Typography>Phiếu nhập</Typography>;
    case 1:
      return <Typography>Phiếu xuất</Typography>;
    case 2:
      return <Typography>Báo nợ</Typography>;
    case 3:
      return <Typography>Báo có</Typography>;
    case 4:
      return <Typography>Phiếu thu</Typography>;
    case 5:
      return <Typography>Phiếu chi</Typography>;
    case 6:
      return <Typography>Kết chuyển</Typography>;
    case 7:
      return <Typography>Khác</Typography>;
    default:
      return null;
  }
};



const CaseActionType = (value: number) => {
  switch (value) {
    case 0:
      return <Typography>Tạo</Typography>;
    case 1:
      return <Typography>Sửa</Typography>;
    case 2:
      return <Typography>Xóa</Typography>;
    default:
      return null;
  }
};

const boxSX = {
  color: 'rgb(0, 123, 255)',
  fontWeight: 500,
  '&:hover': {
    color: 'rgb(0, 123, 255)',
  },
};

interface Props {
  pageNumber: number;
  pageSize: number;
  open: (data: any) => void;
}

const columnsHelper = getColumnHelper<TransactionHistory>();

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, open: openDialog } = props;
  const dialog = useDialog();
  const columns: ProColumn<TransactionHistory> = useMemo(() => {
    return [
      Selection<TransactionHistory>(),
      columnsHelper.accessor('id', {
        id: 'id',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.id,
        cell: (context) => {
          const { code } = context.row.original;
          return (
            <Box><Typography>{code}</Typography></Box>
          )
        },
        meta: {
          title: HEAD_CELLS.id,
          align: 'center',
        },
      }),

      columnsHelper.accessor('transactionCode', {
        id: 'transactionCode',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.transactionCode,
        cell: (context) => {
          const { transactionCode } = context.row.original;
          return (
            <Stack direction="column">
              <Link sx={boxSX} href={`/accounting/transaction/index?entryCode=${transactionCode}`}>
                {transactionCode}
              </Link>
            </Stack >
          )
        },
        meta: {
          title: HEAD_CELLS.transactionCode,
          align: 'center',
        },
      }),

      columnsHelper.accessor('transactionDate', {
        id: 'transactionDate',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.transactionDate,
        cell: (context) => <Box>{DateTime.Format(context.getValue(), 'DD-MM-YYYY')}</Box>,
        meta: {
          title: HEAD_CELLS.transactionDate,
          align: 'center',
        },
      }),

      columnsHelper.accessor('documentCode', {
        id: 'documentCode',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.documentCode,
        cell: (context) => <Box>{context.getValue()}</Box>,
        meta: {
          title: HEAD_CELLS.documentCode,
          align: 'center',
        },
      }),

      columnsHelper.accessor('ticketType', {
        id: 'ticketType',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.ticketType,
        cell: (context) => {
          return (
            <Stack direction="column" alignItems="center" spacing={0}>
              <Stack direction="row" spacing={1}>
                <Box>{CaseTicketType(context.getValue())}</Box>
              </Stack>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.ticketType,
          align: 'center',
        },
      }),

      columnsHelper.accessor('totalTransactionMoney', {
        id: 'totalTransactionMoney',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalTransactionMoney,
        cell: (context) => (
          <Box display="flex" justifyContent="end">
            {Numeral.price(context.getValue())}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.totalTransactionMoney,
          align: 'center',
        },
      }),

      columnsHelper.accessor('userAction', {
        id: 'userAction',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.userAction,
        cell: (context) => <Box>{context.getValue()}</Box>,
        meta: {
          title: HEAD_CELLS.userAction,
          align: 'center',
        },
      }),
      columnsHelper.accessor('action', {
        id: 'action',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.action,
        cell: (context) => {
          const { action } = context.row.original;
          return (
            <Stack direction="column" alignItems="center" spacing={0}>
              <Stack direction="row" spacing={1}>
                <Box>{CaseActionType(context.getValue())}</Box>
              </Stack>
            </Stack>
          )
        },
        meta: {
          title: HEAD_CELLS.action,
          align: 'center',
        },
      }),
      {
        id: 'actions',
        size: 10,
        enableSorting: false,
        header: () => HEAD_CELLS.actions,
        cell: (context) => {
          const rowId = context.row.id;
          const rowIndex = context.row.index;
          const { action } = context.row.original;
          const handleView = () => {
            if (action === 2) {
              dialog({
                headline: 'Thông báo',
                hideAccept: true,
                content: <div style={{ width: '250px', textAlign: 'center' }}>Phiếu đã bị xóa</div>,
              });
            } else {
              openDialog(context.row.original)
            }

          };
          return (
            <IconButton onClick={handleView}>
              <VisibilityIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
          colSpan: () => 1,
        },
      },
    ];
  }, [dialog]);
  return { columns };
};

export default useTableColumns;
