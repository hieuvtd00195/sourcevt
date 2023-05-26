import EditIcon from '@mui/icons-material/Edit';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { IconButton, Link, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { SaleOrder } from 'types/saleorder';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';
import Selection from 'components/ProTable/components/Selection';

const styles = {
  textDecoration: 'none',
  '&:hover': {
    color: 'white',
  },
};

const columnHelper = getColumnHelper<SaleOrder>();

const HEAD_CELLS: HeadCell<SaleOrder> = {
  index: 'ID',
  orderDate: 'Ngày',
  code: 'Mã đơn hàng',
  storeId: 'Id cửa hàng',
  storeName: 'Kho hàng',
  supplierName: 'NCC',
  invoiceNumber: 'Số hóa đơn',
  totalProduct: 'SL SP',
  totalQuantity: 'Tổng SL',
  totalPriceNDT: 'TT tệ',
  totalPrice: 'Tổng tiền',
  note: 'ghi chú',
  creatorName: 'Người lập',
  isConfirm: 'Xác nhận',
  totalApprove: 'Trạng thái duyệt',
  status: 'Trạng thái phiếu',
  actions: 'Hành động',
};

const boxSX = {
  color: 'rgb(0, 123, 255)',
  fontWeight: 500,
  '&:hover': {
    color: 'rgb(0, 123, 255)',
  },
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleConfirm: () => void;
  handleEditNote: (id: any, note: any) => void;
  handleDelete: (id: string) => void;
  handleOpenFormConfirm: (id: any) => void;
  handleComplete: (id: string) => void;
}

const useTableColumns = (props: Props) => {
  const {
    pageNumber,
    pageSize,
    handleConfirm,
    handleEditNote,
    handleDelete,
    handleOpenFormConfirm,
    handleComplete,
  } = props;
  const dialog = useDialog();
  const navigate = useNavigate();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      Selection<any>(),
      columnHelper.accessor('id', {
        id: 'id',
        enableSorting: false,
        header: () => 'ID ',
        cell: (context) => {
          const value = context.getValue();
          const { code } = context.row.original;
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Link href={`/inventory/order-slip/detail/${value}`} sx={boxSX}>
                {code}
              </Link>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.id,
          align: 'center',
        },
      }),
      columnHelper.accessor('orderDate', {
        id: 'orderDate',
        enableSorting: false,
        header: () => 'Ngày',
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{DateTime.Format(value, 'DD-MM-YYYY')} </Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.orderDate,
          align: 'center',
        },
      }),
      columnHelper.accessor('storeName', {
        id: 'storeName',
        header: () => 'Cửa hàng',
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
          title: HEAD_CELLS.storeName,
          align: 'center',
        },
      }),
      columnHelper.accessor('supplierName', {
        id: 'supplierName',
        header: () => 'NCC',
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
          title: HEAD_CELLS.supplierName,
          align: 'center',
        },
      }),
      columnHelper.accessor('invoiceNumber', {
        id: 'invoiceNumber',
        header: () => 'Số hóa đơn',
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Link href={`/`} sx={boxSX}>
                {value}
              </Link>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.invoiceNumber,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalProduct', {
        id: 'totalProduct',
        header: () => 'SL SP',
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography> {Numeral.price(value)}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.totalProduct,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalQuantity', {
        id: 'totalQuantity',
        header: () => 'Tổng SL',
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography> {Numeral.price(value)}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.totalQuantity,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPriceNDT', {
        id: 'totalPriceNDT',
        header: () => 'TT tệ',
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography> {Numeral.price(value)}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.totalPriceNDT,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        header: () => 'Tổng tiền',
        enableSorting: false,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography> {Numeral.price(value)}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.totalPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        enableSorting: false,
        header: () => 'Ghi chú',
        cell: (context) => {
          const { note, id } = context.row.original;
          return (
            // <IconButton onClick={() => handleEditNote(id, note)}>
            //   <EditIcon />
            // </IconButton>
            <Box sx={{ textAlign: 'center' }}>
              <Typography> {context.getValue()}</Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
          align: 'center',
        },
      }),
      columnHelper.accessor('creatorName', {
        id: 'creatorName',
        header: () => 'Người lập',
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
          title: HEAD_CELLS.creatorName,
          align: 'center',
        },
      }),
      columnHelper.accessor('isConfirm', {
        id: 'isConfirm',
        enableSorting: false,
        header: () => 'Xác nhận',
        cell: (context) => {
          const { note, id, isConfirm } = context.row.original;
          //   return <Button onClick={handleConfirm}>Xác nhận</Button>;
          return (
            <Button
              disabled={isConfirm}
              onClick={() => handleOpenFormConfirm(id)}
            >
              Xác nhận
            </Button>
          );
        },
        meta: {
          title: HEAD_CELLS.isConfirm,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalApprove', {
        id: 'totalApprove',
        size: 100,
        enableSorting: false,
        header: () => 'Trạng thái duyệt',
        cell: (context) => {
          const value = context.getValue();
          const { totalQuantity } = context.row.original;
          return (
            <Typography>
              {Numeral.price(value)} / {Numeral.price(totalQuantity)}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.totalApprove,
          align: 'center',
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 150,
        enableSorting: false,
        header: () => 'Trạng thái phiếu',
        cell: (context) => {
          //   const handleConfirmComplete = () => {
          //     dialog({
          //       headline: 'Xác nhận?',
          //       supportingText: (
          //         <Fragment>
          //           Bạn có chắc chắn muốn hoàn thành đơn hàng này không?
          //         </Fragment>
          //       ),
          //       onConfirm: async () => {},
          //     });
          //   };
          const value = context.getValue();
          //   return <Button onClick={handleConfirmComplete}>Hoàn thành</Button>;
          return (
            <Typography>
              {value === 1 ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.status,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const { id, code, status } = context.row.original;
          const handleDeleteRow = () => {
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
          const handleCompleteAcpt = () => {
            dialog({
              headline: 'Xác nhận hoàn thành?',
              supportingText: (
                <Fragment>
                  Bạn có chắc chắn muốn Hoàn thành : <strong>{code}</strong>
                </Fragment>
              ),
              onConfirm: async () => {
                if (id) {
                  handleComplete(id);
                }
              },
            });
          };
          const handleNavigate = () => {
            navigate(`/inventory/order-slip/detail/${id}`);
          };
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Xem chi tiết',
                  value: 1,
                  actionType: 'view',
                  onSelect: () => handleNavigate(),
                },
                {
                  label: 'Sửa thông tin',
                  value: 2,
                  actionType: 'edit',
                  disabled: status === 1 ? true : false,
                  onSelect: () =>
                    navigate('edit/' + context?.row?.original?.id),
                },
                {
                  label: 'Xóa',
                  value: 3,
                  actionType: 'delete',
                  onSelect: handleDeleteRow,
                },
                {
                  label: 'Xem ảnh phiếu',
                  value: 4,
                  actionType: 'view',
                  //   onSelect: handleDeleteRow,
                  onSelect: () => console.log('delete'),
                },
                {
                  label: 'Upload',
                  value: 5,
                  actionType: 'upload',
                  //   onSelect: handleDeleteRow,
                  onSelect: () => console.log('delete'),
                },
                {
                  label: 'Hoàn thành',
                  value: 6,
                  disabled: status === 1 ? true : false,
                  actionType: 'check',
                  onSelect: handleCompleteAcpt,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, dialog]);

  return { columns };
};

export default useTableColumns;
