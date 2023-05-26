import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Button, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Numeral from 'utils/Numeral';
import { transportOrder } from './utils/types';

interface saleOrders {
  code: string | null;
  id: string | null;
  invoiceNumber: string | null;
  supplierId: string | null;
  supplierName: string | null;
  totalPrice: number | null;
}

const columnHelper = getColumnHelper<transportOrder>();

const HEAD_CELLS: HeadCell<transportOrder> = {
  order: 'STT',
  code: 'ID',
  supplierName: 'Nhà cung cấp',
  invoiceNumber: 'Số hóa đơn',
  totalPrice: 'Tổng số tiền',
  transporterText: 'Nhà vận chuyển',
  transportCode: 'Mã đơn vận',
  status: 'Trạng thái',
  saleOrders: '',
  actions: 'Hành động',
};

interface Props {
  pageIndex: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageIndex, pageSize } = props;
  const dialog = useDialog();
  const navigate = useNavigate();

  const columns: ProColumn<transportOrder> = useMemo(() => {
    return [
      columnHelper.accessor('order', {
        id: 'order',
        size: 50,
        enableSorting: false,
        header: () => 'STT',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.order,
          align: 'center',
        },
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 120,
        enableSorting: false,
        header: () => 'ID',
        cell: (context) => {
          const saleOrders: saleOrders[] =
            context?.row?.original?.saleOrders ?? [];
          return (
            <BoxContent>
              {saleOrders &&
                saleOrders.length > 0 &&
                saleOrders.map((item) => {
                  return (
                    <LinkButton
                      key={item.id}
                      variant="text"
                      onClick={() =>
                        navigate(
                          `/inventory/order-slip?value=filter&code=${item.code}`
                        )
                      }
                    >
                      {item.code}
                    </LinkButton>
                  );
                })}
            </BoxContent>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
        },
      }),
      columnHelper.accessor('supplierName', {
        id: 'supplierName',
        size: 250,
        enableSorting: false,
        header: () => 'Nhà cung cấp',
        cell: (context) => {
          const saleOrders: saleOrders[] =
            context?.row?.original?.saleOrders ?? [];
          return (
            <>
              {saleOrders &&
                saleOrders.length > 0 &&
                saleOrders.map((item) => {
                  return (
                    <Typography variant="subtitle2" sx={{ padding: '4px' }}>
                      {item.supplierName}
                    </Typography>
                  );
                })}
            </>
          );
        },
        meta: {
          title: HEAD_CELLS.supplierName,
          align: 'center',
        },
      }),
      columnHelper.accessor('invoiceNumber', {
        id: 'invoiceNumber',
        size: 150,
        enableSorting: false,
        header: () => 'Hóa đơn',
        cell: (context) => {
          const saleOrders: saleOrders[] =
            context?.row?.original?.saleOrders ?? [];
          return (
            <BoxContent>
              {saleOrders &&
                saleOrders.length > 0 &&
                saleOrders.map((item) => {
                  return (
                    <LinkButton
                      key={item.id}
                      variant="text"
                      onClick={() =>
                        navigate(
                          `/inventory/order-slip?value=filter&invoiceNumber=${item.invoiceNumber}&supplierName=${item.supplierName}`
                        )
                      }
                    >
                      {item.invoiceNumber}
                    </LinkButton>
                  );
                })}
            </BoxContent>
          );
        },
        meta: {
          title: HEAD_CELLS.invoiceNumber,
          align: 'center',
        },
      }),

      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        enableSorting: false,
        size: 150,
        header: () => 'Tổng số tiền',
        cell: (context) => {
          return (
            <Typography variant="subtitle2">
              {Numeral.price(context.getValue())}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.totalPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('transporterText', {
        id: 'transporterText',
        enableSorting: false,
        size: 80,
        header: () => 'Nhà vận chuyển',
        cell: (context) => {
          return (
            <Typography variant="subtitle2">{context.getValue()}</Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.transporterText,
          align: 'center',
        },
      }),

      columnHelper.accessor('transportCode', {
        id: 'transportCode',
        enableSorting: false,
        size: 100,
        header: () => 'Mã đơn vận',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.transportCode,
          align: 'center',
        },
      }),

      columnHelper.accessor('status', {
        id: 'status',
        size: 100,
        enableSorting: false,
        header: () => 'Trạng thái',
        cell: (context) => {
          const value = parseInt(context.getValue() ?? '');
          let result = '';
          switch (value) {
            case 0:
              result = 'Chưa nhận';
              break;

            case 1:
              result = 'Đã nhận';
              break;
            default:
              result = '';
              break;
          }
          return <Typography variant="subtitle2">{result}</Typography>;
        },
        meta: {
          title: HEAD_CELLS.status,
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
                  label: 'Sửa',
                  value: 2,
                  actionType: 'edit',
                  onSelect: () =>
                    navigate(
                      'orderTransport/edit/' + context?.row?.original?.id
                    ),
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
  }, [pageIndex, pageSize, dialog]);

  return { columns };
};

const LinkButton = styled(Button)`
  margin: 0;
  background: #fff;
  color: #2196f3;
  -webkit-user-select: text;
  user-select: text;
  &:hover {
    transition: 2s;
    text-decoration: underline;
  }
`;

const BoxContent = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
`;

export default useTableColumns;
