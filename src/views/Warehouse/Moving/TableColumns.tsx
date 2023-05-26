import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import { IWarehouseTransfer } from 'types/warehouseTransfer';
import { Box, Link, Tooltip } from '@mui/material';
import DateTime from 'utils/DateTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link as RouterLink } from 'react-router-dom';

const transferBillType = (value: number) => {
  switch (value) {
    case null:
      return 'Xuất chuyển kho';
    default:
      return 'Xuất chuyển kho';
  }
};

const columnHelper = getColumnHelper<IWarehouseTransfer>();

const HEAD_CELLS: HeadCell<IWarehouseTransfer> = {
  index: 'ID',
  createdTime: 'Ngày tạo phiếu',
  warehouse: 'Cửa hàng',
  transferBillType: 'Kiểu chuyển kho',
  sp: 'SP',
  quantity: 'SL',
  creatorName: 'Người tạo',
  note: 'Ghi chú',
  browser: 'Duyệt',
  confirm: 'Xác nhận',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleDelete: (id: string) => void;
}

const useTableColumnsMoving = (props: Props) => {
  const { pageNumber, pageSize, handleDelete } = props;
  const dialog = useDialog();

  const columns: ProColumn<IWarehouseTransfer> = useMemo(() => {
    return [
      Selection<any>(),
      // Index<any>(pageNumber, pageSize),
      columnHelper.accessor('ID', {
        id: 'ID',
        size: 60,
        header: () => HEAD_CELLS.index,
        enableSorting: false,
        cell: (context) => {
          const { code, id } = context.row.original;
          return (
            <Box>
              <Link color={'#007bff'} href={`/warehouse/moving-detail/${id}`}>
                {code}
              </Link>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.index,
        },
      }),

      columnHelper.accessor('createdTime', {
        id: 'createdTime',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.createdTime,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{DateTime.Format(value, 'DD-MM-YYYY')} </Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.createdTime,
        },
      }),

      columnHelper.accessor('warehouse', {
        id: 'warehouse',
        size: 250,
        header: () => HEAD_CELLS.warehouse,
        enableSorting: false,
        cell: (context) => {
          const { sourceStoreName, destinationStoreName, transferBillType } =
            context.row.original;
          return (
            <Box>
              <Typography>{sourceStoreName}</Typography>
              <ArrowRightAltIcon
                sx={{
                  color: 'red',
                  rotate: '0deg',
                }}
              />
              <Typography>{destinationStoreName}</Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.warehouse,
        },
      }),
      columnHelper.accessor('transferBillType', {
        id: 'transferBillType',
        size: 60,
        header: () => HEAD_CELLS.transferBillType,
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();

          return (
            <Box>
              <Typography>{transferBillType(value)}</Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.transferBillType,
        },
      }),
      columnHelper.accessor('sp', {
        id: 'sp',
        size: 60,
        header: () => HEAD_CELLS.sp,
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.sp,
        },
      }),

      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 60,
        header: () => HEAD_CELLS.quantity,
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.quantity,
        },
      }),
      columnHelper.accessor('creatorName', {
        id: 'creatorName',
        size: 250,
        header: () => HEAD_CELLS.creatorName,
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.creatorName,
        },
      }),
      columnHelper.accessor('browser', {
        id: 'browser',
        size: 250,
        header: () => HEAD_CELLS.browser,
        enableSorting: false,
        cell: (context) => {
          const { draftApprovedUserName, draftApprovedDate } =
            context.row.original;

          return (
            <Typography variant="subtitle2" sx={{ color: 'green' }}>
              {draftApprovedUserName}
              <Typography variant="subtitle1" sx={{ color: '#000' }}>
                {DateTime.Format(draftApprovedDate, 'HH:mm DD/MM')}
              </Typography>
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.browser,
        },
      }),
      columnHelper.accessor('confirm', {
        id: 'confirm',
        size: 160,
        header: () => HEAD_CELLS.confirm,
        enableSorting: false,
        cell: (context) => {
          const { id } = context.row.original;
          return (
            <Tooltip title="Xác nhận">
              <RouterLink to={`/warehouse/accept-moving/${id}`}>
                <SwipeRightIcon color="error" sx={{ marginRight: '8px' }} />
                Xác nhận
              </RouterLink>
            </Tooltip>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.confirm,
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        // header: () => (
        //   <Tooltip title="Ghi chú">
        //     {/* <SmsFailedIcon color="error" /> */}
        //   </Tooltip>
        // ),
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.note,
        },
      }),

      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const handleDeleteRow = () => {
            const { id, code } = context.row.original;

            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: (
                <Fragment>
                  Bạn có chắc chắn muốn xóa: <strong>{code}</strong>
                </Fragment>
              ),
              onConfirm: async () => {
                if (id) {
                  handleDelete(id);
                }
              },
            });
          };

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'In Phiếu',
                  value: 1,
                  actionType: 'add',
                },
                {
                  label: 'In mã vạch',
                  value: 2,
                  actionType: 'print',
                },
                {
                  label: 'Xuất Excel in mã vạch bằng Bartender',
                  value: 2,
                  actionType: 'change',
                },
                {
                  label: 'Xóa',
                  value: 3,
                  actionType: 'delete',
                  onSelect: handleDeleteRow,
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
        },
      },
    ];
  }, [dialog]);

  return { columns };
};

export default useTableColumnsMoving;
