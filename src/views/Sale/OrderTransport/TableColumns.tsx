import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import DateTime from 'utils/DateTime';
import { IOrderTransportList, IRetail } from 'types/retail';
import { useNavigate } from 'react-router-dom';

const columnHelper = getColumnHelper<IOrderTransportList>();

const HEAD_CELLS: HeadCell<IRetail> = {
  creator: 'Người tạo',
  idBill: 'ID',
  store: 'Cửa hàng',
  customerName: 'Tên khách hàng',
  transportPhoneNumber: 'Điện thoại',
  isWarehouseTransfer: 'Chuyển kho',
  shipperName: "Nhân viên giao hàng",
  status: 'Trạng thái',
  createTime: 'Ngày tạo',
  shipTime: 'Ngày giao hàng',
  note: 'Ghi chú',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleOpenDialog: (value: any) => void;
  handleOpenEditNoteDialog: (value: any) => void;
  handleOpenUpdateShipper: (data: any) => void;
  handleOpenUpdateStatus: (data: any) => void;
}

const transportFormType = (value: number) => {
  switch (value) {
    case null:
      return 'Không vận chuyển';
    case 1:
      return 'Không vận chuyển';
    case 2:
      return 'Nội bộ';
    case 3:
      return 'Qua hãng';
    default:
      return null;
  }
};

const transportStatusType = (value: number) => {
  switch (value) {
    case null:
      return 'Chờ giao hàng';
    case 0:
      return 'Chờ giao hàng';
    case 1:
      return 'Đang giao';
    case 2:
      return 'Tạo đơn';
    case 3:
      return 'Lấy hàng';
    case 4:
      return 'Ngày lấy hàng';
    case 5:
      return 'Đã lấy hàng';
    case 6:
      return 'Thành công';
    case 7:
      return 'Đối soát';
    case 8:
      return 'Trả hàng';
    case 9:
      return 'Đã hủy';
    default:
      return null;
  }
};

const useTableColumns = (props: Props) => {
  const {
    handleOpenEditNoteDialog,
    handleOpenUpdateShipper,
    handleOpenUpdateStatus,
  } = props;

  const navigate = useNavigate();

  const columns: ProColumn<IOrderTransportList> = useMemo(() => {
    return [
      Selection<any>(),
      // columnHelper.accessor('creator', {
      //   id: 'creator',
      //   size: 100,
      //   header: () => 'ID',
      //   // cell: (context) => {
      //   //   const value = context.getValue();
      //   //   return (
      //   //     <Box>
      //   //       <Typography color="#007bff">{value}</Typography>
      //   //     </Box>
      //   //   );
      //   // },
      //   // cell: (context) => <Typography color="#007bff">12481</Typography>,
      //   meta: {
      //     title: HEAD_CELLS.creator,
      //     colSpan: () => null,
      //   },
      // }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        header: () => 'ID',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography color="#007bff">{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.creator,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('fromStoreName', {
        id: 'fromStoreName',
        size: 100,
        header: () => 'Cửa hàng',
        cell: (context) => {
          const value = context.getValue();

          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.idBill,
          colSpan: () => null,
        },
      }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        size: 150,
        header: () => HEAD_CELLS.customerName,
        cell: (context) => {
          const value = context.getValue();
          const { customerPhoneNumber } = context.row.original;
          return (
            <Box>
              <Typography>{value}</Typography>
              <Typography>{customerPhoneNumber}</Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.customerName,
        },
      }),
      columnHelper.accessor('transportName', {
        id: 'transportName',
        size: 100,
        enableSorting: false,
        header: () => 'Tên nhà vận chuyển',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.customer,
        },
      }),
      columnHelper.accessor('transportPhoneNumber', {
        id: 'transportPhoneNumber',
        size: 100,
        enableSorting: false,
        header: () => 'Điện thoại',
        cell: (context) => context.getValue(),
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.transportPhoneNumber,
        },
      }),
      columnHelper.accessor('isWarehouseTransfer', {
        id: 'isWarehouseTransfer',
        size: 100,
        header: () => 'Chuyển kho',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value ? 'Có' : 'Không'}</Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.isWarehouseTransfer,
        },
      }),
      columnHelper.accessor('shipperName', {
        id: 'shipperName',
        size: 100,
        enableSorting: false,
        header: () => 'Nhân viên giao hàng',
        cell: (context) => context.getValue(),
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.shipperName,
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 130,
        header: () => 'Trạng thái',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{transportStatusType(value)}</Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.status,
        },
      }),
      columnHelper.accessor('createTime', {
        id: 'createTime',
        size: 150,
        enableSorting: false,
        header: () => 'Ngày tạo',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{DateTime.Format(value, 'DD-MM-YYYY')}</Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.createTime,
        },
      }),
      columnHelper.accessor('shipTime', {
        id: 'shipTime',
        size: 150,
        enableSorting: false,
        header: () => 'Ngày giao hàng',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{DateTime.Format(value, 'DD-MM-YYYY')}</Typography>
            </Box>
          );
        },
        meta: {
          colSpan: () => null,
          title: HEAD_CELLS.shipTime,
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 100,
        enableSorting: false,
        header: () => 'Ghi chú',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box>
              <Typography>{value}</Typography>
            </Box>
          );
        },
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
          const status = Number(context?.row?.original?.status);
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Cập nhật',
                  value: 1,
                  actionType: 'edit',
                  onSelect: () =>
                    navigate(`update/${context?.row?.original?.id}`),
                },
                {
                  label: 'Cập nhật nhân viên giao hàng',
                  value: 2,
                  actionType: 'edit',
                  disabled: status === 9 ? true : false,
                  onSelect: () =>
                    handleOpenUpdateShipper(context?.row?.original),
                },
                {
                  label: 'Cập nhật trạng thái',
                  value: 3,
                  disabled: status === 9 ? true : false,
                  actionType: 'edit',
                  onSelect: () =>
                    handleOpenUpdateStatus(context?.row?.original),
                },
                {
                  label: 'Xóa',
                  value: 3,
                  actionType: 'delete',
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
          colSpan: () => null,
        },
      },
    ];
  }, []);

  return { columns };
};

export default useTableColumns;
