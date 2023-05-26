import React from 'react';
import { PaymentTerm } from '../../utils/type';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { useMemo } from 'react';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const columnHelper = getColumnHelper<PaymentTerm>();

interface Props {
  pageNumber: number;
  pageSize: number;
}

const HEAD_CELLS: HeadCell<PaymentTerm> = {
  createDate: 'Ngày tạo',
  creator: 'Người lập phiếu',
  paymentTerm: 'Hạn thanh toán',
  customer: 'Khách hàng',
  bill: 'Hóa đơn',
  money: 'Tiền hàng',
  discount: 'Chiết khấu',
  totalPaid: 'Tổng thanh toán',
  paid: 'Đã thanh toán',
  stillOwed: 'Còn nợ',
  store: 'Cửa hàng',
  phoneNumber: 'Số điện thoại',
  seller: 'Nhân viên bán hàng',
};

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const dialog = useDialog();

  const columns: ProColumn<PaymentTerm> = useMemo(() => {
    return [
      columnHelper.accessor('createDate', {
        id: 'createDate',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.createDate,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.createDate,
          align: 'center',
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.creator,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.creator,
          align: 'center',
        },
      }),
      columnHelper.accessor('paymentTerm', {
        id: 'paymentTerm',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.paymentTerm,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.paymentTerm,
          align: 'center',
        },
      }),
      columnHelper.accessor('store', {
        id: 'store',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.store,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.store,
          align: 'center',
        },
      }),
      columnHelper.accessor('customer', {
        id: 'customer',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.customer,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.customer,
          align: 'center',
        },
      }),
      columnHelper.accessor('phoneNumber', {
        id: 'phoneNumber',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.phoneNumber,
        cell: (context) => (
          <Typography sx={{ color: 'blue' }}>{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.phoneNumber,
          align: 'center',
        },
      }),
      columnHelper.accessor('bill', {
        id: 'bill',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.bill,
        cell: (context) => (
          <Typography sx={{ color: 'blue' }}>{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.bill,
          align: 'center',
        },
      }),
      columnHelper.accessor('money', {
        id: 'money',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.money,
        cell: (context) =>
          context.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          }),
        meta: {
          title: HEAD_CELLS.money,
          align: 'center',
        },
      }),
      columnHelper.accessor('discount', {
        id: 'discount',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.discount,
        cell: (context) =>
          context.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          }),
        meta: {
          title: HEAD_CELLS.discount,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPaid', {
        id: 'totalPaid',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.totalPaid,
        cell: (context) =>
          context.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          }),
        meta: {
          title: HEAD_CELLS.totalPaid,
          align: 'center',
        },
      }),
      columnHelper.accessor('paid', {
        id: 'paid',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.paid,
        cell: (context) =>
          context.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          }),
        meta: {
          title: HEAD_CELLS.paid,
          align: 'center',
        },
      }),
      columnHelper.accessor('stillOwed', {
        id: 'stillOwed',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.stillOwed,
        cell: (context) =>
          context.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          }),
        meta: {
          title: HEAD_CELLS.stillOwed,
          align: 'center',
        },
      }),
      columnHelper.accessor('seller', {
        id: 'seller',
        size: 80,
        enableSorting: false,
        header: () => HEAD_CELLS.seller,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.stillOwed,
          align: 'center',
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Thanh toán công nợ bằng tiền mặt',
                  value: 2,
                  actionType: 'money',
                },
                {
                  label: 'Thanh toán công nợ bằng chuyển khoản',
                  value: 3,
                  actionType: 'credit',
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
  }, [pageNumber, pageSize, dialog]);
  return { columns };
};

export default useTableColumns;
