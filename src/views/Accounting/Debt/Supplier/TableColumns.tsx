import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Link, Typography } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Index from 'components/ProTable/components/Index';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { useTypedSelector } from 'store';
import { DebtSupplier } from 'types/debtSupplier';
import Currency from 'utils/Currency';

const columnHelper = getColumnHelper<DebtSupplier>();

const HEAD_CELLS: HeadCell<DebtSupplier> = {
  index: '[1]',
  customer: 'Khách hàng [2]',
  beginDebt: 'Nợ [Phải thu] [3]',
  beginCredit: 'Có [Phải trả] [4]',
  debt: 'Nợ [5]',
  credit: 'Có [6]',
  endDebt: 'Nợ [Phải thu] = 3 + 5 - 4 - 6',
  endCredit: 'Có [Phải trả] = 4 + 6 - 3 - 5',
};

interface Props {
  pageNumber: number;
  pageSize: number;
}
const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const { ndt } = useTypedSelector((state) => state.debtSupplier);

  const columns: ProColumn<DebtSupplier> = useMemo(() => {
    return [
      Index<DebtSupplier>(pageNumber, pageSize),
      columnHelper.group({
        id: 'objects',
        header: 'Đối tượng',
        columns: [
          columnHelper.accessor('customerId', {
            id: 'customer',
            size: 150,
            enableSorting: false,
            header: () => HEAD_CELLS.customer,
            cell: (context) => {
              const { id, supplierCode, supplierId, supplierName, phoneNumber } =
                context.row.original;
              return (
                <Link
                  href={`supplier/${supplierId}`}
                  underline="none"
                  target="_blank"
                >
                  <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
                    NCC.{supplierCode} - {supplierName}
                    <br />
                    ĐT: {phoneNumber}
                  </Typography>
                </Link>
              );
            },
            meta: {
              title: HEAD_CELLS.customer,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),

      columnHelper.group({
        id: 'openingBalance',
        header: 'Số dư đầu kỳ',
        columns: [
          columnHelper.accessor('beginDebt', {
            id: 'beginDebt',
            size: 80,
            enableSorting: false,
            header: () => HEAD_CELLS.beginDebt,
            cell: (context) => {
              const { supplierType } = context.row.original;

              if (supplierType === 0) {
                if (ndt > 0) {
                  return Currency.FormatVND(context.getValue() * ndt);
                } else {
                  return Currency.FormatNDT(context.getValue());
                }
              }

              return Currency.FormatVND(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.beginDebt,
            },
          }),
          columnHelper.accessor('beginCredit', {
            id: 'beginCredit',
            size: 80,
            enableSorting: false,
            header: () => HEAD_CELLS.beginCredit,
            cell: (context) => {
              const { supplierType } = context.row.original;

              if (supplierType === 0) {
                if (ndt > 0) {
                  return Currency.FormatVND(context.getValue() * ndt);
                } else {
                  return Currency.FormatNDT(context.getValue());
                }
              }

              return Currency.FormatVND(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.beginCredit,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'arising',
        header: 'Phát sinh giữa kỳ',
        columns: [
          columnHelper.accessor('debt', {
            id: 'debt',
            size: 80,
            enableSorting: false,
            header: () => HEAD_CELLS.debt,
            cell: (context) => {
              const { supplierType } = context.row.original;

              if (supplierType === 0) {
                if (ndt > 0) {
                  return Currency.FormatVND(context.getValue() * ndt);
                } else {
                  return Currency.FormatNDT(context.getValue());
                }
              }

              return Currency.FormatVND(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.debt,
            },
          }),
          columnHelper.accessor('credit', {
            id: 'credit',
            size: 80,
            enableSorting: false,
            header: () => HEAD_CELLS.credit,
            cell: (context) => {
              const { supplierType } = context.row.original;

              if (supplierType === 0) {
                if (ndt > 0) {
                  return Currency.FormatVND(context.getValue() * ndt);
                } else {
                  return Currency.FormatNDT(context.getValue());
                }
              }

              return Currency.FormatVND(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.credit,
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'endingBalance',
        header: 'Số dư cuối kỳ',
        columns: [
          columnHelper.accessor('endDebt', {
            id: 'endDebt',
            size: 80,
            enableSorting: false,
            header: () => HEAD_CELLS.endDebt,
            cell: (context) => {
              const { supplierType } = context.row.original;

              if (supplierType === 0) {
                if (ndt > 0) {
                  return Currency.FormatVND(context.getValue() * ndt);
                } else {
                  return Currency.FormatNDT(context.getValue());
                }
              }

              return Currency.FormatVND(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.endDebt,
            },
          }),
          columnHelper.accessor('endCredit', {
            id: 'endCredit',
            size: 80,
            enableSorting: false,
            header: () => HEAD_CELLS.endCredit,
            cell: (context) => {
              const { supplierType } = context.row.original;

              if (supplierType === 0) {
                if (ndt > 0) {
                  return Currency.FormatVND(context.getValue() * ndt);
                } else {
                  return Currency.FormatNDT(context.getValue());
                }
              }

              return Currency.FormatVND(context.getValue());
            },
            meta: {
              title: HEAD_CELLS.endCredit,
            },
          }),
        ],
        meta: {
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
                  label: 'Lập phiếu thu',
                  value: 2,
                  actionType: 'add',
                },
                {
                  label: 'Lập phiếu báo nợ',
                  value: 3,
                  actionType: 'add',
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
  }, [ndt, pageNumber, pageSize]);
  return { columns };
};

export default useTableColumns;
