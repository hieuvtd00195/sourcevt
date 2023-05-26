import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import { Box, Button, Link } from '@mui/material';
import { IWarehouseTransfer } from 'types/warehouseTransfer';
import DateTime from 'utils/DateTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import Numeral from 'utils/Numeral';
const columnHelper = getColumnHelper<IWarehouseTransfer>();

const HEAD_CELLS: HeadCell<IWarehouseTransfer> = {
  index: 'ID',
  warehouseTransferCode: 'Mã chuyển kho',
  warehouseTransferCreatedTime: 'Ngày tạo',
  warehouse: "Cửa hàng",
  sp: 'SP',
  quantity: 'SL',
  totalMoney: 'Tổng tiền',
  discount: 'Chiết khấu',
  transferBillType: 'Kiểu phiếu',
  hasAttachment: 'Có file đính kèm không',
  creatorName: 'Người tạo',
  note: 'Ghi chú',
};

const transferBillType = (value: number) => {
  switch (value) {
    case null:
      return "Nhập chuyển kho"
    case 0:
      return "Nhập chuyển kho";
    case 1:
      return "Xuất chuyển kho";
    default:
      return null;
  }
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleDelete: (id: string) => void;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize, handleDelete } = props;
  const dialog = useDialog();
  const navigate = useNavigate();

  const columns: ProColumn<IWarehouseTransfer> = useMemo(() => {

    return [
      Selection<any>(),
      // Index<any>(pageNumber, pageSize),
      columnHelper.accessor('id', {
        id: 'id',
        enableSorting: false,
        header: () => HEAD_CELLS.index,
        cell: (context) => {
          const { warehouseTransferCode, id, warehouseTransferCreatedTime } = context.row.original;
          const date = DateTime.Format(warehouseTransferCreatedTime, 'DD-MM-YYYY HH:mm')
          return (
            <Tooltip title={date}>
              <Box>
                <Link color={'#007bff'} href={`/warehouse/detail/${id}`}>
                  {warehouseTransferCode}
                </Link>
              </Box>
            </Tooltip>

          );
        },
        meta: {
          title: HEAD_CELLS.warehouseTransferCode,
          align: 'center',
        },
      }),
      columnHelper.accessor('warehouseTransferCreatedTime', {
        id: 'warehouseTransferCreatedTime',
        size: 250,
        enableSorting: false,
        header: () => HEAD_CELLS.warehouseTransferCreatedTime,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>
                {DateTime.Format(value, 'DD-MM-YYYY')}{' '}
              </Typography>
            </Box>
          );
        },
        meta: {
          align: 'center',
          title: HEAD_CELLS.warehouseTransferCreatedTime,
        },
      }),

      columnHelper.accessor('warehouse', {
        id: 'warehouse',
        size: 150,
        header: () => HEAD_CELLS.warehouse,
        enableSorting: false,
        cell: (context) => {
          const { inputStoreName, exportStoreName, transferBillType } = context.row.original;
          return (
            <Box>
              <Typography>{transferBillType === 1 ? inputStoreName : exportStoreName}</Typography>
              <ArrowRightAltIcon
                sx={{
                  color: transferBillType === 1 ? 'red' : 'blue',
                  rotate: transferBillType === 1 ? '0' : '180deg'
                }} />
              <Typography>{transferBillType === 1 ? exportStoreName : inputStoreName}</Typography>
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
        }, meta: {
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
        }, meta: {
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
        }, meta: {
          align: 'center',
          title: HEAD_CELLS.quantity,
        },
      }),
      columnHelper.accessor('totalMoney', {
        id: 'totalMoney',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.totalMoney,
        cell: (context) => Numeral.price(context.getValue()),

        meta: {
          align: 'center',
          title: HEAD_CELLS.totalMoney,
        },
      }),
      columnHelper.accessor('discount', {
        id: 'discount',
        size: 60,
        header: () => HEAD_CELLS.discount,
        enableSorting: false,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          align: 'center',
          title: HEAD_CELLS.discount,
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
      columnHelper.accessor('hasAttachment', {
        id: 'hasAttachment',
        size: 60,
        header: () => HEAD_CELLS.hasAttachment,
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{value}</Typography>
            </Box>
          );
        }, meta: {
          title: HEAD_CELLS.hasAttachment,
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
            const { id, warehouseTransferCode, warehousingBills } = context.row.original;

            const result = warehousingBills.map((item: any, index: number) => {
              return (
                <strong>
                  <Link color={'#007bff'}
                    href={`/inventory?value=filter&code=${item.warehousingBillCode}`}
                  >
                    {item.warehousingBillCode}
                  </Link>
                </strong>
              )
            }).reduce((acc: any, curr: any) => [acc, ', ', curr]);
            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: (
                <Fragment>
                  Cần xóa phiếu yêu cầu XNK ID:{' '}
                  {result}
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
                // {
                //   label: 'In Phiếu',
                //   value: 1,
                //   actionType: 'add',
                // },
                // {
                //   label: 'In mã vạch',
                //   value: 2,
                //   actionType: 'print',
                // },
                // {
                //   label: 'Xuất Excel in mã vạch bằng Bartender',
                //   value: 2,
                //   actionType: 'change',
                // },
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

export default useTableColumns;
