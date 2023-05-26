import EditIcon from '@mui/icons-material/Edit';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, Link, Stack, Typography } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Selection from 'components/ProTable/components/Selection';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';
import { isEmpty } from 'lodash';
import { Entry } from './utils/type';
import ProFormDependency from 'components/ProForm/ProFormDependency';

const columnHelper = getColumnHelper<Entry>();

const HEAD_CELLS: HeadCell<Entry> = {
  index: 'STT',
  code: 'ID',
  parentCode: "ID bút toán",
  date: 'Ngày tạo công nợ',
  ticketType: 'Loại',
  documentType: 'Chứng từ',
  debtAmount: 'Ghi nợ',
  creditAmount: 'Ghi có',
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
          const value = context.getValue();
          const { id } = context.row.original;
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
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
              <Link
                underline="none"
                target="_blank"
                href={`/accounting/transaction/detail/${id}`}
                sx={boxSX}
              >
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

      columnHelper.accessor('ticketType', {
        id: 'ticketType',
        enableSorting: false,
        size: 200,
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
        footer: (context) => <Typography fontWeight="bold" sx={{ color: '#000000' }}>Tổng</Typography>,
        meta: {
          title: HEAD_CELLS.documentType,
          align: 'center',
        },
      }),

      columnHelper.accessor('debtAmount', {
        id: 'debtAmount',
        enableSorting: false,
        header: () => HEAD_CELLS.debtAmount,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{Numeral.price(value)}</Typography>
            </Box>
          );
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];

          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const Total = item.original.debtAmount
              arrayTotal.push(Total);
            });
          }
          let totalDebtAmount: number = 0;
          for (var i in arrayTotal) {
            totalDebtAmount += arrayTotal[i];
          }
          return (
            <Typography fontWeight="bold" sx={{ color: '#000000', textAlign: 'center' }}>
              {Numeral.price(totalDebtAmount)}
            </Typography>
          )
        },
        meta: {
          title: HEAD_CELLS.debtAmount,
          align: 'center',
        },
      }),

      columnHelper.accessor('creditAmount', {
        id: 'creditAmount',
        enableSorting: false,
        header: () => HEAD_CELLS.creditAmount,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{Numeral.price(value)}</Typography>
            </Box>
          );
        },
        footer: (context) => {
          const getRows = context.table.getFilteredRowModel().rows;
          const arrayTotal: number[] = [];

          if (!isEmpty(getRows)) {
            getRows.forEach((item: any, index: any) => {
              const Total = item.original.creditAmount
              arrayTotal.push(Total);
            });
          }
          let totalCreditAmount: number = 0;
          for (var i in arrayTotal) {
            totalCreditAmount += arrayTotal[i];
          }
          return (
            <Typography fontWeight="bold" sx={{ color: '#000000', textAlign: 'center' }}>
              {Numeral.price(totalCreditAmount)}
            </Typography>
          )
        },
        meta: {
          title: HEAD_CELLS.creditAmount,
          align: 'center',
        },
      }),



      columnHelper.accessor('note', {
        id: 'note',
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
          align: 'center',
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const { id, debtAmount } = context.row.original;
          const rowId = context.row.id;
          const rowIndex = context.row.index;
          const handleDeleteRow = () => {
            // dialog({
            //   supportingText: 'Bạn có chắc chắn muốn xóa phiếu này không?',
            //   onConfirm: onDelete(rowIndex, id),
            // });
          };

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: debtAmount > 0 ? 'Tạo phiếu thu' : 'Tạo phiếu chi',
                  value: 21,
                  actionType: 'edit',
                  onSelect: () =>
                    navigate(`/inventory/bill/edit/${id}/${debtAmount}`),
                },
                {
                  label: debtAmount > 0 ? 'Tạo phiếu báo có' : 'Tạo phiếu báo nợ',
                  value: 2,
                  actionType: 'edit',
                  onSelect: () =>
                    navigate(`/inventory/bill/edit/${id}/${debtAmount}`),
                },
                {
                  label: 'Xóa phiếu',
                  value: 3,
                  actionType: 'delete',
                  onSelect: () => {
                    handleDeleteRow()
                  }
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
  }, [dialog, navigate]);

  return { columns };
};

export default useTableColumns;
