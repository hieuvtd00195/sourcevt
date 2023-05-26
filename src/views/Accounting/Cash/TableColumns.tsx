import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Box, IconButton, Link, Stack, Tooltip } from '@mui/material';
import { Account, Cash } from './utils/type';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import useDialog from 'hooks/useDialog';
import DateTime from 'utils/DateTime';
import EditIcon from '@mui/icons-material/Edit';

const columnHelper = getColumnHelper<Cash>();

const HEAD_CELLS: HeadCell<Cash> = {
  index: 'STT',
  transactionId: 'ID | Ngày',
  type: 'Loại',
  account: 'Tài khoản',
  contraAccount: 'Tài khoản đối ứng',
  object: 'Đối tượng',
  document: 'Chứng từ',
  receive: 'Thu',
  spend: 'Chi',
  creator: 'Người tạo',
  note: 'Ghi chú',
  file: 'file',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditNote: (id: number, note: string) => void;
}

const useTableColumns = (props: Props) => {
  const { handleEditNote } = props;
  const dialog = useDialog();
  const columns: ProColumn<Cash> = useMemo(() => {
    return [
      Selection<Cash>(),
      columnHelper.accessor('transactionId', {
        id: 'transactionId',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.transactionId,
        cell: (context) => {
          const { transactionId, date } = context.row.original;
          return (
            <Tooltip title={DateTime.Format(date, 'YYYY-MM-DD HH:MM:ss')}>
              <Stack direction="column" spacing={0}>
                <Link
                  href="https://www.google.com.vn/?hl=vi"
                  underline="none"
                  target="_blank"
                  color={'#007bff'}
                >
                  {transactionId}
                </Link>
                <Box>{DateTime.Format(date, 'MM-DD')}</Box>
              </Stack>
            </Tooltip>
          );
        },
        meta: {
          title: HEAD_CELLS.transactionId,
          align: 'center',
        },
      }),
      columnHelper.accessor('type', {
        id: 'type',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.type,
        cell: (context) => {
          const value = context.getValue();
          if (!value) return;
          return (
            <Stack direction="column" spacing={0}>
              {[1, 2].includes(value) && (
                <Tooltip title="Phiếu thu" placement="top">
                  <ArrowBackIcon color="info" />
                </Tooltip>
              )}
              {[3, 4].includes(value) && (
                <Tooltip title="Phiếu chi" placement="top">
                  <ArrowForwardIcon color="error" />
                </Tooltip>
              )}
              {[2, 4].includes(value) && (
                <Tooltip title="Hạch toán tự tạo">
                  <PersonIcon />
                </Tooltip>
              )}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.type,
          align: 'center',
        },
      }),
      columnHelper.accessor('account', {
        id: 'account',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.account,
        cell: (context) => {
          return (
            <Stack direction="column" spacing={0}>
              <Box>{`${context.getValue<Account>().id}`}</Box>
              <Box>{`${context.getValue<Account>().info}`}</Box>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.account,
        },
      }),
      columnHelper.accessor('contraAccount', {
        id: 'contraAccount',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.contraAccount,
        cell: (context) => {
          return (
            <Stack direction="column" spacing={0}>
              <Box>{`${context.getValue<Account>().id}`}</Box>
              <Box>{`${context.getValue<Account>().info}`}</Box>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.contraAccount,
        },
      }),
      columnHelper.accessor('object', {
        id: 'object',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.object,
        cell: (context) => {
          return (
            <Stack direction="column" spacing={0}>
              <Box>{`KH.${context.getValue<Account>().id}`}</Box>
              <Link
                href="https://www.google.com.vn/?hl=vi"
                underline="none"
                target="_blank"
                color={'#007bff'}
              >
                {`${context.getValue<Account>().info}`}
              </Link>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.object,
        },
      }),

      columnHelper.accessor('document', {
        id: 'document',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.document,
        cell: (context) => (
          <Box>
            Phiếu XNK:{' '}
            <Link
              href="https://www.google.com.vn/?hl=vi"
              underline="none"
              target="_blank"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.document,
        },
      }),
      columnHelper.accessor('receive', {
        id: 'receive',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.receive,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.receive,
        },
      }),
      columnHelper.accessor('spend', {
        id: 'spend',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.spend,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.spend,
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.creator,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.creator,
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const { note, id } = context.row.original;
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {note}
              <IconButton onClick={() => handleEditNote(id, note)}>
                <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
              </IconButton>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
        },
      }),
      columnHelper.accessor('file', {
        id: 'file',
        size: 50,
        enableSorting: false,
        header: () => (
          <Tooltip title="File đính kèm" placement="top">
            <AttachFileIcon sx={{ color: 'text.secondary' }} />
          </Tooltip>
        ),
        cell: (context) => <AddIcon color="primary" />,
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
                  label: 'In phiếu',
                  value: 1,
                  actionType: 'save',
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
  }, [dialog, handleEditNote]);

  return { columns };
};

export default useTableColumns;
