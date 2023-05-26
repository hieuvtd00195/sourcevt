import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { Box, Link, Stack, Typography } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';

import { Entry } from './utils/type';
import useNotification from 'hooks/useNotification';

const columnHelper = getColumnHelper<Entry>();

const HEAD_CELLS: HeadCell<Entry> = {
  index: 'STT',
  code: 'ID Bút toán',
  transactionDate: 'Ngày thu chi',
  ticketType: 'Loại phiếu',
  audienceType: 'Đối tượng',
  documentType: 'Chứng từ',
  amount: 'Số tiền',
  debtAccount: 'Nợ',
  creditAccount: 'Có',
  note: 'Ghi chú',
  audiencePhone: 'Số điện thoại đối tượng',
  audienceCode: 'id đối tượng',
  accounts: 'DSTK',
  //   file: 'File',
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
      return <Typography>Đơn vận chuyển</Typography>;
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
    case 8:
      return <Typography>Phiếu bán hàng</Typography>;
    case 9:
      return <Typography>Trả hàng</Typography>;
    case 10:
      return <Typography>Chuyển quỹ</Typography>;
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
  onDelete: (id: string | null) => void;
}

const useTableColumns = (props: Props) => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const onSelectDelete = (data: Entry) => {
    const documentTypeName = data?.documentTypeName ?? '';
    const documentCode = data?.documentCode ?? '';
    const value =
      documentCode && documentTypeName
        ? documentCode.concat('-', documentTypeName)
        : documentCode.concat('', documentTypeName);
    if (data?.accountingType === 0) {
      setNotification({
        error: `Bạn không được xóa phiếu này, xin vui lòng sửa từ ${value} `,
      });
    } else {
      dialog({
        supportingText: 'Bạn có chắc chắn muốn xóa đơn hàng này không?',
        onConfirm: () => onDelete(data?.id),
      });
    }
  };

  const onSelectUpdate = (data: Entry) => {
    const { id } = data;
    const documentTypeName = data?.documentTypeName ?? '';
    const documentCode = data?.documentCode ?? '';
    const value =
      documentCode && documentTypeName
        ? documentCode.concat('-', documentTypeName)
        : documentCode.concat('', documentTypeName);
    if (data?.accountingType === 0) {
      dialog({
        headline: 'Thông báo',
        supportingText: (
          <Fragment>
            Bạn không được sửa bút toán này, xin vui lòng sửa từ{' '}
            <Link
              href={`/inventory?value=filter&code=${documentCode}`}
              fontWeight="bold"
              color="#2593FC"
            >
              {documentCode}
            </Link>
          </Fragment>
        ),
        onConfirm: async () => {},
      });
    } else {
      id && navigate(`/accounting/transaction/update/${id.toString()}`);
    }
  };

  const { onDelete } = props;
  const columns: ProColumn<Entry> = useMemo(() => {
    return [
      //   Selection<Entry>(),
      columnHelper.accessor('code', {
        id: 'code',
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => {
          const { code, id } = context.row.original;
          return (
            // <Tooltip title={DateTime.Format(date, 'YYYY-MM-DD')}>
            <Stack direction="column">
              <Link
                href={`/accounting/transaction/detail/${id}?code=${code}`}
                underline="none"
                target="_blank"
                sx={boxSX}
              >
                {code}
              </Link>
              {/* <Box>{DateTime.Format(date, 'MM-DD')}</Box> */}
            </Stack>
            // </Tooltip>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
        },
      }),

      columnHelper.accessor('transactionDate', {
        id: 'transactionDate',
        enableSorting: false,
        header: () => HEAD_CELLS.transactionDate,
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
          title: HEAD_CELLS.transactionDate,
          align: 'center',
        },
      }),

      columnHelper.accessor('ticketType', {
        id: 'ticketType',
        enableSorting: false,
        header: () => HEAD_CELLS.ticketType,
        cell: (context) => {
          const value = context.getValue();
          return <Stack direction="column">{CaseTicketType(value)}</Stack>;
        },
        meta: {
          title: HEAD_CELLS.ticketType,
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

      columnHelper.accessor('documentType', {
        id: 'documentType',
        enableSorting: false,
        size: 250,
        header: () => HEAD_CELLS.documentType,
        cell: (context) => {
          const { documentCode, documentType, documentTypeName } =
            context.row.original;
          return (
            <Stack direction="row" alignItems="center">
              <Box> {documentTypeName}</Box>
              {documentType === 4 ? (
                <Link
                  href={`/inventory?value=filter&code=${documentCode}`}
                  sx={boxSX}
                >
                  {documentCode}
                </Link>
              ) : (
                // <Typography> {documentCode}</Typography>
                <Link
                  href={`/inventory?value=filter&code=${documentCode}`}
                  sx={boxSX}
                >
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

      columnHelper.accessor('amount', {
        id: 'amount',
        enableSorting: false,

        header: () => HEAD_CELLS.amount,
        cell: (context) => {
          const { accounts } = context.row.original;
          return (
            <Box>
              {accounts?.map((item: any, index: any) => (
                <div>
                  {item.amountCny > 0 ? (
                    <Typography color="primary">
                      {Numeral.price(item.amountCny)}
                    </Typography>
                  ) : (
                    <Typography>{Numeral.price(item.amountVnd)}</Typography>
                  )}
                </div>
              ))}
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.amount,
          align: 'center',
        },
      }),

      columnHelper.accessor('debtAccount', {
        id: 'debtAccount',
        enableSorting: false,
        header: () => HEAD_CELLS.debtAccount,
        cell: (context) => {
          const { debtAccount, accounts } = context.row.original;
          return (
            <Box>
              {accounts?.map((item: any, index: any) => (
                <Typography>
                  {item.debtAccountCode ? (
                    item.debtAccountCode
                  ) : (
                    <div>&nbsp;</div>
                  )}
                </Typography>
              ))}
            </Box>
          );
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
          const { creditAccountCode, accounts } = context.row.original;
          return (
            <Box>
              {accounts?.map((item: any, index: any) => (
                <Typography>
                  {item.creditAccountCode ? (
                    item.creditAccountCode
                  ) : (
                    <div>&nbsp;</div>
                  )}
                </Typography>
              ))}
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.creditAccount,
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

              {/* <IconButton onClick={() => handleEditNote(id, note)}> */}
              {/* <IconButton onClick={() => console.log()}>
                <EditIcon sx={{ color: 'text.secondary' }} />
              </IconButton> */}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
          align: 'center',
        },
      }),

      //   columnHelper.accessor('file', {
      //     id: 'file',
      //     size: 50,
      //     enableSorting: false,
      //     header: () => HEAD_CELLS.file,
      //     cell: (context) => {
      //       return (
      //         <IconButton>
      //           <AddIcon color="primary" />
      //         </IconButton>
      //       );
      //     },
      //     meta: {
      //       title: HEAD_CELLS.file,
      //       align: 'center',
      //     },
      //   }),

      {
        id: 'actions',
        size: 10,
        enableSorting: false,
        header: () => <SettingsOutlined sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const { id } = context.row.original;

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'In Phiếu',
                  value: 1,
                  actionType: 'save',
                },
                {
                  label: 'Sửa',
                  value: 2,
                  actionType: 'edit',
                  onSelect: () => onSelectUpdate(context.row.original),
                },
                {
                  label: 'Xóa',
                  value: 3,
                  actionType: 'delete',
                  onSelect: () => onSelectDelete(context.row.original),
                },
              ]}
            >
              <ActionIconButton actionType="more" />
            </ProMenu>
          );
        },
      },
    ];
  }, [dialog, navigate]);

  return { columns };
};

export default useTableColumns;
