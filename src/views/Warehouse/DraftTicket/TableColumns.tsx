import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import { Box, Link, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import SelectionCheckbox from 'components/ProTable/components/SelectionCheckbox';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setId, setSelected } from 'slices/draftTicket';
import { useTypedSelector } from 'store';
import { DraftTicket } from 'types/draftTicket';
import DateTime from 'utils/DateTime';

const columnHelper = getColumnHelper<DraftTicket>();

const HEAD_CELLS: HeadCell<DraftTicket> = {
  id: 'ID',
  date: 'Ngày',
  warehouse: 'Kho hàng',
  style: 'Kiểu',
  sp: 'SP',
  sl: 'SL',
  note: 'Ghi chú',

  discount: 'Chiết khấu',
  creator: 'Người tạo',
  comment: 'Ghi chú',
  browser: 'Duyệt',
  confirm: 'Xác nhận',
  status: 'Trạng thái',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleDelete: (id: string) => void;
}

const useTableColumnnsDraft = (props: Props) => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selected } = useTypedSelector((state) => state.draftTicket);

  const { handleDelete } = props;

  const onSelect = useCallback(
    (value: DraftTicket[]) => {
      dispatch(setSelected(value));
    },
    [dispatch]
  );

  const columns: ProColumn<DraftTicket> = useMemo(() => {
    return [
      SelectionCheckbox<DraftTicket>({
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
              href={`/warehouse/draft/${id || '#'}`}
              underline="none"
              target="_blank"
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
      columnHelper.accessor('creationTime', {
        id: 'date',
        size: 50,
        header: () => HEAD_CELLS.date,
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
          const {
            sourceStoreName,
            destinationStoreName,
            deliveryConfirmedUserId,
          } = context.row.original;

          return deliveryConfirmedUserId ? (
            <Stack flexDirection="row" flexWrap="wrap">
              <Typography variant="subtitle2">
                {destinationStoreName}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
                {'<-'}
              </Typography>
              <Typography variant="subtitle2">{sourceStoreName}</Typography>
            </Stack>
          ) : (
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
        cell: (context) => {
          const { deliveryConfirmedUserId } = context.row.original;
          return deliveryConfirmedUserId ? (
            <Typography variant="subtitle2" sx={{ color: '#f44336' }}>
              Nhập chuyển kho
            </Typography>
          ) : (
            <Typography variant="subtitle2">Xuất chuyển kho</Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.style,
        },
      }),

      columnHelper.accessor('totalProductCode', {
        id: 'sp',
        size: 60,
        header: () => HEAD_CELLS.sp,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.sp,
        },
      }),

      columnHelper.accessor('totalNumberProduct', {
        id: 'sl',
        size: 60,
        header: () => HEAD_CELLS.sl,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.sl,
        },
      }),

      columnHelper.accessor('creatorName', {
        id: 'creator',
        size: 250,
        header: () => HEAD_CELLS.creator,
        cell: (context) => {
          const { creationTime } = context.row.original;
          return (
            <Typography variant="subtitle2">
              {context.getValue()}
              <Typography variant="subtitle1">
                {DateTime.Format(creationTime, 'HH:mm DD/MM')}
              </Typography>
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.creator,
        },
      }),
      columnHelper.accessor('draftApprovedUserId', {
        id: 'browser',
        size: 160,
        header: () => HEAD_CELLS.browser,
        cell: (context) => {
          const {
            transferStatus,
            id,
            draftApprovedDate,
            draftApprovedName,
            status,
          } = context.row.original;

          const navigateToBrowser = () => {
            if (id) {
              dispatch(setId(id));
              navigate('/warehouse/browser');
            }
          };

          if (status === 1 || status === 2) {
            return (
              <Typography variant="subtitle2">
                {draftApprovedName}
                <Typography variant="subtitle1">
                  {DateTime.Format(draftApprovedDate, 'HH:mm DD/MM')}
                </Typography>
              </Typography>
            );
          }

          if (status === 0) {
            return (
              <Tooltip placement="top" title="Duyệt">
                <Stack
                  flexDirection="row"
                  gap="8px"
                  sx={{
                    textDecoration: 'underline',
                    color: '#007bff',
                  }}
                  onClick={navigateToBrowser}
                >
                  <SwipeRightIcon color="error" />
                  Duyệt
                </Stack>
              </Tooltip>
            );
          }

          return '';
        },
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.browser,
        },
      }),
      columnHelper.accessor('deliveryConfirmedUserId', {
        id: 'confirm',
        size: 160,
        header: () => HEAD_CELLS.confirm,
        cell: (context) => {
          const { deliveryConfirmedDate, deliveryConfirmedName, status } =
            context.row.original;

          if (status === 2) {
            return (
              <Typography variant="subtitle2">
                {deliveryConfirmedName}
                <Typography variant="subtitle1">
                  {DateTime.Format(deliveryConfirmedDate, 'HH:mm DD/MM')}
                </Typography>
              </Typography>
            );
          }
          return <></>;
        },
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.confirm,
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 160,
        header: () => HEAD_CELLS.status,
        cell: (context) => {
          const status = context.getValue();

          if (status === 0) return 'Mới';
          if (status === 1) return 'Đã duyệt';
          if (status === 2) return 'Đã xác nhận';
          if (status === 3) return 'Đã hủy';

          return '';
        },
        enableSorting: false,
        meta: {
          title: HEAD_CELLS.status,
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
            const {
              id,
              code,
              warehousingBillCodePNK,
              warehousingBillCodePXK,
              status,
            } = context.row.original;

            if (status === 2) {
              dialog({
                headline: 'Thông báo',
                supportingText: (
                  <Stack
                    flexDirection="row"
                    alignItems="flex-end"
                    gap="4px"
                    sx={{ width: '330px' }}
                  >
                    <Box sx={{ lineHeight: '28px' }}>
                      Cần xóa phiếu yêu cầu XNK ID:{' '}
                      <Link
                        href={`/inventory?value=filter&code=${warehousingBillCodePNK}`}
                        fontWeight="bold"
                        color="#2593FC"
                        sx={{ marginLeft: '0 !important', lineHeight: '28px' }}
                      >
                        {warehousingBillCodePNK}
                      </Link>
                      {', '}
                      <Link
                        href={`/inventory?value=filter&code=${warehousingBillCodePXK}`}
                        fontWeight="bold"
                        color="#2593FC"
                        sx={{ marginLeft: '0 !important', lineHeight: '28px' }}
                      >
                        {warehousingBillCodePXK}
                      </Link>
                    </Box>
                  </Stack>
                ),
                onConfirm: () => {
                  navigate(
                    `/inventory?value=filter&code=${warehousingBillCodePNK}`
                  );
                },
              });
              return;
            }

            if (status === 1) {
              dialog({
                headline: 'Thông báo',
                supportingText: (
                  <Stack
                    flexDirection="row"
                    alignItems="flex-end"
                    gap="4px"
                    sx={{ width: '330px' }}
                  >
                    <Box sx={{ lineHeight: '28px' }}>
                      Cần xóa phiếu yêu cầu XNK ID:{' '}
                    </Box>

                    <Link
                      href={`/inventory?value=filter&code=${warehousingBillCodePXK}`}
                      fontWeight="bold"
                      color="#2593FC"
                      sx={{ marginLeft: '0 !important', lineHeight: '28px' }}
                    >
                      {warehousingBillCodePXK}
                    </Link>
                  </Stack>
                ),
                onConfirm: () => {
                  navigate(
                    `/inventory?value=filter&code=${warehousingBillCodePXK}`
                  );
                },
              });
              return;
            }

            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: (
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
  }, [dialog, dispatch, handleDelete, navigate, onSelect, selected]);

  return { columns };
};

export default useTableColumnnsDraft;
