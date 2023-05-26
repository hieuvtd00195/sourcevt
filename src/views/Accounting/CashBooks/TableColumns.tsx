import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { Box, Link, Stack, Typography } from '@mui/material';
import { Cash } from './utils/type';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DateTime from 'utils/DateTime';
import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ProMenu from 'components/ProMenu';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import { useNavigate } from 'react-router-dom';
import useNotification from 'hooks/useNotification';
import useDialog from 'hooks/useDialog';
const columnHelper = getColumnHelper<Cash>();

const HEAD_CELLS: HeadCell<Cash> = {
  index: 'STT',
  code: 'ID',
  type: 'Loại',
  accountCode: ' Mã tài khoản',
  reciprocalAccountCode: 'Mã tài khoản đối ứng',
  ticketTypeName: 'Loại phiếu',
  audienceTypeName: 'Đối tượng',
  receive: 'Thu',
  spend: 'Chi',
  documentTypeName: 'Chứng từ',
  note: 'Ghi chú',
  file: 'Diễn giải',
  transactionDate: 'Ngày',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditNote: (id: number, note: string) => void;
  handleDelete: (id: string) => void;
}

const useTableColumns = (props: Props) => {
  const { handleDelete } = props;
  const dialog = useDialog();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const onSelectDelete = (data: Cash) => {
    const { id, code, documentTypeName, documentCode } = data;

    let href = '#';

    switch (documentTypeName) {
      case 'Phiếu Xuất kho':
        href = `/inventory?value=filter&code=${documentCode}`;
        break;
      case 'Phiếu Nhập kho':
        href = `/inventory?value=filter&code=${documentCode}`;
        break;
      case 'Bút toán':
        href = `/accounting/transaction/index?entryCode=${documentCode}`;
        break;

      default:
        break;
    }

    if (data?.accountingType === 0) {
      dialog({
        headline: 'Xóa phiếu thu/chi',
        supportingText: (
          <Stack
            flexDirection="row"
            alignItems="flex-end"
            gap="4px"
            sx={{ width: '400px' }}
          >
            <Box sx={{ lineHeight: '28px' }}>
              Bạn không được xóa phiếu này, xin vui lòng sửa từ{' '}
              {documentTypeName || ''}:{' '}
              <Link href={href} style={{ color: '#007bff' }}>
                <span>{documentCode}</span>
              </Link>
            </Box>
          </Stack>
        ),
        onConfirm: () => {
          handleDelete(id);
        },
      });
    } else {
      dialog({
        headline: 'Xóa phiếu thu/chi',
        supportingText: (
          <Stack
            flexDirection="row"
            alignItems="flex-end"
            gap="4px"
            sx={{ width: '390px' }}
          >
            <Box sx={{ lineHeight: '28px' }}>
              Bạn có chắc muốn xóa phiếu thu/chi:
            </Box>
            <Typography
              fontWeight="bold"
              sx={{ marginLeft: '0 !important', lineHeight: '28px' }}
            >
              {code}
            </Typography>
          </Stack>
        ),
        onConfirm: () => {
          handleDelete(id);
        },
      });
    }
  };

  const onSelectUpdate = (data: Cash) => {
    const { id, documentTypeName, documentCode } = data;
    let href = '#';

    switch (documentTypeName) {
      case 'Phiếu Xuất kho':
        href = `/inventory?value=filter&code=${documentCode}`;
        break;
      case 'Phiếu Nhập kho':
        href = `/inventory?value=filter&code=${documentCode}`;
        break;
      case 'Bút toán':
        href = `/accounting/transaction/index?entryCode=${documentCode}`;
        break;

      default:
        break;
    }

    if (data?.accountingType === 0) {
      dialog({
        headline: 'Sửa phiếu thu/chi',
        supportingText: (
          <Stack
            flexDirection="row"
            alignItems="flex-end"
            gap="4px"
            sx={{ width: '400px' }}
          >
            <Box sx={{ lineHeight: '28px' }}>
              Bạn không được sửa phiếu này, xin vui lòng sửa từ{' '}
              {documentTypeName || ''}:{' '}
              <Link href={href} style={{ color: '#007bff' }}>
                <span>{documentCode}</span>
              </Link>
            </Box>
          </Stack>
        ),
        onConfirm: () => {
          handleDelete(id);
        },
      });
    } else {
      navigate(`/accounting/details/${data.id}`);
    }
  };

  const columns: ProColumn<Cash> = useMemo(() => {
    return [
      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => {
          const code = context.getValue();
          return (
            <Stack direction="column" spacing={0}>
              {code}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        enableSorting: false,
        header: () => <AttachFileIcon />,
        cell: (context) => {
          return (
            <Box sx={{ cursor: 'pointer' }}>
              <AddIcon />
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.transactionId,
          align: 'center',
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('transactionDate', {
        id: 'transactionDate',
        size: 120,
        enableSorting: false,
        header: () => HEAD_CELLS.transactionDate,
        cell: (context) => {
          const transactionDate = context.getValue();
          return (
            <Stack direction="column" spacing={0}>
              {DateTime.Format(transactionDate, 'DD-MM-YYYY')}
            </Stack>
          );
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.transactionDate,
          align: 'center',
        },
      }),

      columnHelper.accessor('accountCode', {
        id: 'accountCode',
        size: 60,
        enableSorting: false,
        header: () => HEAD_CELLS.accountCode,
        cell: (context) => {
          const accountCode = context.getValue() ?? '';
          const accountName = context.row.original?.accountName ?? '';
          const value =
            accountCode && accountName
              ? accountCode.concat('-', accountName)
              : accountCode.concat('', accountName);
          return <Typography>{value}</Typography>;
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.accountCode,
        },
      }),

      columnHelper.accessor('reciprocalAccountCode', {
        id: 'reciprocalAccountCode',
        size: 120,
        enableSorting: false,
        header: () => HEAD_CELLS.reciprocalAccountCode,
        cell: (context) => {
          const reciprocalAccountCode = context.getValue() ?? '';
          const reciprocalAccountName = context.row.original?.accountName ?? '';
          const value =
            reciprocalAccountCode && reciprocalAccountName
              ? reciprocalAccountCode.concat('-', reciprocalAccountName)
              : reciprocalAccountCode.concat('', reciprocalAccountName);
          return <Typography>{value}</Typography>;
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.reciprocalAccountCode,
        },
      }),

      columnHelper.accessor('ticketTypeName', {
        id: 'ticketTypeName',
        size: 120,
        enableSorting: false,
        header: () => HEAD_CELLS.ticketTypeName,
        cell: (context) => {
          return (
            <Stack direction="column" spacing={0}>
              <Box>{`${context.getValue()}`}</Box>
            </Stack>
          );
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.ticketTypeName,
        },
      }),
      columnHelper.accessor('audienceTypeName', {
        id: 'audienceTypeName',
        size: 160,
        enableSorting: false,
        header: () => HEAD_CELLS.audienceTypeName,
        cell: (context) => {
          const type = context.getValue() ?? '';
          const audienceCode = context.row.original?.audienceCode ?? '';
          const audienceName = context.row.original?.audienceName ?? '';
          const audiencePhone = context.row.original?.audiencePhone ?? '';

          return (
            <Box sx={{ cursor: 'pointer' }}>
              <Typography color="blue">
                {`${type}${type && audienceCode ? ' - ' : ''}${audienceCode}${
                  audienceCode && audienceName ? ' - ' : ''
                }${audienceName}${
                  audienceName && audiencePhone ? ' - ' : ''
                }${audiencePhone}`}
              </Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.audienceTypeName,
        },
      }),

      columnHelper.accessor('documentTypeName', {
        id: 'documentTypeName',
        size: 120,
        enableSorting: false,
        header: () => HEAD_CELLS.documentTypeName,
        cell: (context) => {
          const type = context.getValue() ?? '';
          const documentCode = context.row.original?.documentCode ?? '';
          const value =
            type && documentCode
              ? type.concat(' - ', documentCode)
              : type.concat('', documentCode);

          let href = '#';

          switch (type) {
            case 'Phiếu Xuất kho':
              href = `/inventory?value=filter&code=${documentCode}`;
              break;
            case 'Phiếu Nhập kho':
              href = `/inventory?value=filter&code=${documentCode}`;
              break;
            case 'Bút toán':
              href = `/accounting/transaction/index?entryCode=${documentCode}`;
              break;

            default:
              break;
          }

          return (
            documentCode && (
              <Link href={href} target="_blank" sx={{ color: 'blue' }}>
                {value}
              </Link>
            )
          );
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.documentTypeName,
        },
      }),
      columnHelper.accessor('receive', {
        id: 'receive',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.receive,
        cell: (context) =>
          context.row.original.amountVND
            ? `${Numeral.price(context.row.original.amountVND)}`
            : null,
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.receive,
        },
      }),

      columnHelper.accessor('spend', {
        id: 'spend',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.spend,
        cell: (context) => {
          return (
            <Box alignItems="center">
              <Typography>
                {context.row.original.amountVND
                  ? `VND: ${Numeral.price(context.row.original.amountVND)}`
                  : null}
              </Typography>
              <Typography color="red">
                {context.row.original.amountCNY
                  ? `TT: ${Numeral.price(context.row.original.amountCNY)}`
                  : null}
              </Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.spend,
        },
      }),

      columnHelper.accessor('note', {
        id: 'note',
        size: 160,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => context.getValue(),
        meta: {
          colSpan: () => null,

          title: HEAD_CELLS.note,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const data = context.row.original;

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa phiếu',
                  value: 1,
                  actionType: 'edit',
                  onSelect: () => onSelectUpdate(data),
                },
                {
                  label: 'Xóa phiếu',
                  value: 2,
                  actionType: 'delete',
                  onSelect: () => onSelectDelete(data),
                },
                {
                  label: 'In phiếu',
                  value: 3,
                  actionType: 'upload',
                },
              ]}
            >
              <ActionIconButton actionType="action" />
            </ProMenu>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
          colSpan: () => null,
        },
      },
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
