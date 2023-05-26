import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import { Box, Link, Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import SelectionCheckbox from 'components/ProTable/components/SelectionCheckbox';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setSelected } from 'slices/warehouseDelivering';
import { useTypedSelector } from 'store';
import { WarehouseTransferMoving } from 'types/warehouseDelivering';
import DateTime from 'utils/DateTime';

const columnHelper = getColumnHelper<WarehouseTransferMoving>();

const HEAD_CELLS: HeadCell<WarehouseTransferMoving> = {
  warehouse: 'Kho hàng',
  id: 'ID',
  createdTime: 'Ngày',
  style: 'Kiểu',
  SP: 'SP',
  SL: 'SL',
  count: 'Tổng tiền',
  discount: 'Chiết khấu',
  creatorName: 'Người tạo',
  comment: 'Ghi chú',
  browser: 'Duyệt',
  confirm: 'Xác nhận',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleDelete: (id: string) => void;
}

const useTableColumnsDelivering = (props: Props) => {
  const { handleDelete } = props;
  const dialog = useDialog();
  const dispatch = useDispatch();
  const { selected } = useTypedSelector((state) => state.warehouseDelivering);

  const onSelect = useCallback(
    (value: WarehouseTransferMoving[]) => {
      dispatch(setSelected(value));
    },
    [dispatch]
  );

  const columns: ProColumn<WarehouseTransferMoving> = useMemo(() => {
    return [
      // Selection<WarehouseTransferMoving>(),
      SelectionCheckbox<WarehouseTransferMoving>({
        fieldName: 'id',
        selected,
        setSelected: onSelect,
      }),

      columnHelper.accessor('code', {
        id: 'id',
        size: 50,
        header: () => HEAD_CELLS.id,
        cell: (context) => {
          const { id } = context.row.original;

          return (
            <Link
              href={`/warehouse/delivering/${id || '#'}`}
              underline="none"
              color={'#007bff'}
            >
              {context.getValue()}
            </Link>
          );
        },
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('createdTime', {
        id: 'createdTime',
        size: 50,
        header: () => HEAD_CELLS.createdTime,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {DateTime.Format(context.getValue(), 'DD/MM')}
          </Typography>
        ),
      }),

      columnHelper.accessor('sourceStoreName', {
        id: 'warehouse',
        size: 250,
        header: () => HEAD_CELLS.warehouse,
        cell: (context) => {
          const { sourceStoreName, destinationStoreName } =
            context.row.original;
          return (
            <Stack flexDirection="row" flexWrap="wrap">
              <Typography variant="subtitle2">{sourceStoreName}</Typography>
              <Typography variant="subtitle2" sx={{ color: '#f44336' }}>
                {'->'}
              </Typography>
              <Typography variant="subtitle2">
                {destinationStoreName}
              </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.warehouse,
        },
      }),

      columnHelper.accessor('id', {
        id: 'style',
        size: 150,
        header: () => HEAD_CELLS.style,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#f44336' }}>
            Xuất chuyển kho
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.style,
        },
      }),
      columnHelper.accessor('sp', {
        id: 'sp',
        size: 60,
        header: () => HEAD_CELLS.SP,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.SP,
        },
      }),

      columnHelper.accessor('quantity', {
        id: 'SL',
        size: 60,
        header: () => HEAD_CELLS.SL,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.SL,
        },
      }),
      columnHelper.accessor('creatorName', {
        id: 'creatorName',
        size: 150,
        header: () => HEAD_CELLS.creatorName,
        cell: (context) => {
          const { createdTime } = context.row.original;

          return (
            <Typography variant="subtitle2">
              {context.getValue()}
              <Typography variant="subtitle1">
                {DateTime.Format(createdTime, 'HH:mm DD/MM')}
              </Typography>
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.creatorName,
        },
      }),
      columnHelper.accessor('isDraftApproved', {
        id: 'browser',
        size: 150,
        header: () => HEAD_CELLS.browser,
        cell: (context) => {
          if (context.getValue()) {
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
          }

          return '';
        },

        meta: {
          title: HEAD_CELLS.browser,
        },
      }),

      columnHelper.accessor('note', {
        id: 'note',
        size: 250,
        enableSorting: false,
        header: () => (
          <Tooltip title="Ghi chú">
            <SmsFailedIcon color="error" />
          </Tooltip>
        ),
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalInventory,
        },
      }),

      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const { id, code, draftApprovedUserName, warehousingBillCode } =
            context.row.original;

          const handleDeleteRow = () => {
            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: draftApprovedUserName ? (
                <Stack
                  flexDirection="row"
                  alignItems="flex-end"
                  gap="4px"
                  sx={{ width: '330px' }}
                >
                  <Box sx={{ lineHeight: '28px' }}>
                    Cần xóa phiếu yêu cầu XNK ID:
                  </Box>
                  <Link
                    href={`/inventory?value=filter1&code=${warehousingBillCode}`}
                    fontWeight="bold"
                    color="#2593FC"
                    sx={{ marginLeft: '0 !important', lineHeight: '28px' }}
                  >
                    {warehousingBillCode}
                  </Link>
                </Stack>
              ) : (
                <Stack
                  flexDirection="row"
                  alignItems="flex-end"
                  gap="4px"
                  sx={{ width: '330px' }}
                >
                  <Box sx={{ lineHeight: '28px' }}>
                    Bạn muốn xóa phiếu nháp ID:
                  </Box>
                  <Typography
                    fontWeight="bold"
                    color="#2593FC"
                    sx={{ marginLeft: '0 !important', lineHeight: '28px' }}
                  >
                    {code}
                  </Typography>
                </Stack>
              ),
              onConfirm: () => {
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
  }, [dialog, handleDelete, onSelect, selected]);

  return { columns };
};

export default useTableColumnsDelivering;
