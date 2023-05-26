import EditIcon from '@mui/icons-material/Edit';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, Link, Stack, Typography } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';

import { Entry } from './utils/type';

const columnHelper = getColumnHelper<Entry>();

const HEAD_CELLS: HeadCell<Entry> = {
  index: 'STT',
  code: 'ID',
  parentCode: "ID Bút toán",
  date: 'Ngày',
  audienceType: 'Đối tượng',
  debtAccount: 'Tài khoản ghi nợ',
  creditAccount: 'Tài khoản ghi có',
  documentType: 'Chứng từ',
  amount: 'Số tiền',
  note: 'Ghi chú',
};

const CaseDocumentReferenceType = (value: number) => {
  switch (value) {
    case 0:
      return <Typography>Phiếu đặt hàng</Typography>;
    case 1:
      return <Typography>Phiếu Nhập kho</Typography>;
    case 2:
      return <Typography>Phiếu Xuất kho</Typography>;
    case 3:
      return <Typography>Phiếu vận chuyển</Typography>;
    case 4:
      return <Typography>Chứng từ ngoài</Typography>;
    default:
      return null;
  }
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

const CaseEntryAudiences = (value: number) => {
  switch (value) {
    case 0:
      return <Typography>KH</Typography>;
    case 1:
      return <Typography>NCC VN</Typography>;
    case 2:
      return <Typography>NCC TQ</Typography>;
    case 3:
      return <Typography>NV</Typography>;
    case 4:
      return <Typography>Khác</Typography>;
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
  pageIndex: number;
  pageSize: number;
  handleEditNote: (id: number, note: string) => void;
}

const useTableColumns = (props: Props) => {
  const dialog = useDialog();
  const navigate = useNavigate();

  const columns: ProColumn<Entry> = useMemo(() => {
    return [
      columnHelper.accessor('code', {
        id: 'code',
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => {
          const { code, id } = context.row.original;
          return (
            <Stack direction="column">
              <Typography>{code}</Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
        },
      }),
      columnHelper.accessor('parentCode', {
        id: 'parentCode',
        enableSorting: false,
        header: () => HEAD_CELLS.parentCode,
        cell: (context) => {
          const { id, parentCode } = context.row.original;
          return (
            <Stack direction="column">
              <Link href={`/accounting/transaction/detail/${id}`} sx={boxSX}>
                {parentCode}
              </Link>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.parentCode,
          align: 'center',
        },
      }),


      columnHelper.accessor('date', {
        id: 'date',
        enableSorting: false,
        header: () => HEAD_CELLS.date,
        cell: (context) => {
          const value = context.getValue();
          if (!value) return;
          return (
            <Stack direction="column">
              <Typography>{DateTime.Format(value, 'DD-MM-YYYY')} </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.date,
          align: 'center',
        },
      }),

      columnHelper.accessor('audienceType', {
        id: 'audienceType',
        enableSorting: false,
        size: 200,
        header: () => HEAD_CELLS.audienceType,
        cell: (context) => {
          const { audienceName, audienceCode, audiencePhone } =
            context.row.original;
          return (
            <Stack direction="column" alignItems="center" spacing={0}>
              <Stack direction="row" spacing={1}>
                {/* <Box>{CaseEntryAudiences(context.getValue())}</Box> */}
                <Box>{CaseEntryAudiences(context.getValue())}</Box>
                <Link href="" sx={boxSX}>{`${audienceCode}`}</Link>
              </Stack>
              <Typography>{audienceName}</Typography>
              <Typography>{audiencePhone}</Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.audienceType,
          align: 'center',
        },
      }),

      columnHelper.accessor('debtAccount', {
        id: 'debtAccount',
        enableSorting: false,
        header: () => HEAD_CELLS.debtAccount,
        cell: (context) => {
          const { debtAccountCode } = context.row.original;
          return <Box>{debtAccountCode ? debtAccountCode : null}</Box>;
        },
        meta: {
          title: HEAD_CELLS.debtAccount,
          align: 'center',
        },
      }),

      columnHelper.accessor('creditAccount', {
        id: 'creditAccount',
        enableSorting: false,
        header: () => HEAD_CELLS.creditAccount,
        cell: (context) => {
          const { creditAccountCode } = context.row.original;
          return <Box>{creditAccountCode ? creditAccountCode : null}</Box>;
        },
        meta: {
          title: HEAD_CELLS.creditAccount,
          align: 'center',
        },
      }),

      columnHelper.accessor('amount', {
        id: 'amount',
        enableSorting: false,

        header: () => HEAD_CELLS.amount,
        cell: (context) => {
          const { amountVnd } = context.row.original;
          return <Box>{Numeral.price(amountVnd)}</Box>;
        },
        meta: {
          title: HEAD_CELLS.amount,
          align: 'center',
        },
      }),

      columnHelper.accessor('documentType', {
        id: 'documentType',
        enableSorting: false,
        size: 250,
        header: () => HEAD_CELLS.documentType,
        cell: (context) => {
          const { documentCode, documentType } = context.row.original;
          return (
            <Stack direction="row" alignItems="center">
              <Box> {CaseDocumentReferenceType(context.getValue())}</Box>
              {documentType === 4 ? (
                <Typography> {documentCode}</Typography>
              ) : (
                <Link href="" sx={boxSX}>
                  {documentCode}
                </Link>
              )}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.documentType,
          align: 'center',
        },
      }),

      columnHelper.accessor('note', {
        id: 'note',
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const { note } = context.row.original;
          return (
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Box>{note}</Box>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
          align: 'center',
        },
      }),
    ];
  }, [dialog, navigate]);

  return { columns };
};

export default useTableColumns;
