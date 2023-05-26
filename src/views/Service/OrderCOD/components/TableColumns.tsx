import { Typography } from '@mui/material';
import Index from 'components/ProTable/components/Index';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { IOrderCODTypes } from '../utils/types';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ProMenu from 'components/ProMenu';
import ActionIconButton from 'components/ProButton/ActionIconButton';

interface Props {
  pageNumber: number;
  pageSize: number;
}

const HEAD_CELLS: HeadCell<IOrderCODTypes> = {
  cod: 'ID đơn vận chuyển',
  customer: 'Khách hàng',
  store: 'Cửa hàng',
  transporter: 'Nhà vận chuyển',
  status: 'Trạng thái',
  commodities: 'Loại hàng',
  statusLading: 'Trạng thái vận đơn',
  totalPrice: 'Tổng tiền',
  createDate: 'Ngày tạo',
  actions: 'Hành động',
};

const columnHelper = getColumnHelper<IOrderCODTypes>();

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const columns: ProColumn<IOrderCODTypes> = useMemo(() => {
    return [
      Index<IOrderCODTypes>(pageNumber, pageSize),
      columnHelper.accessor('cod', {
        id: 'cod',
        size: 200,
        header: () => 'ID đơn vận chuyển',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.cod,
          align: 'center',
        },
      }),
      columnHelper.accessor('customer', {
        id: 'customer',
        size: 200,
        header: () => 'Khách hàng',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.customer,
          align: 'center',
        },
      }),
      columnHelper.accessor('store', {
        id: 'store',
        size: 200,
        header: () => 'Cửa hàng',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.store,
          align: 'center',
        },
      }),
      columnHelper.accessor('transporter', {
        id: 'transporter',
        size: 200,
        header: () => 'Nhà vận chuyển',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.transporter,
          align: 'center',
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 200,
        header: () => 'Trạng thái',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.status,
          align: 'center',
        },
      }),
      columnHelper.accessor('commodities', {
        id: 'commodities',
        size: 200,
        header: () => 'Loại hàng',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.commodities,
          align: 'center',
        },
      }),
      columnHelper.accessor('statusLading', {
        id: 'statusLading',
        size: 200,
        header: () => 'Trạng thái vận đơn',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.statusLading,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        size: 200,
        header: () => HEAD_CELLS.totalPrice,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('createDate', {
        id: 'createDate',
        size: 200,
        header: () => 'Ngày tạo',
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.createDate,
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
                  label: 'Cập nhật trạng thái đơn COD',
                  value: 2,
                  actionType: 'edit',
                },
                {
                  label: 'Cập nhật COD',
                  value: 3,
                  actionType: 'edit',
                },
                {
                  label: 'Gửi code Viettel',
                  value: 4,
                  actionType: 'sms',
                },
                {
                  label: 'COD GHTK',
                  value: 5,
                  actionType: 'sms',
                },
                {
                  label: 'In phiếu GHTK',
                  value: 6,
                  actionType: 'print',
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
  }, [pageNumber, pageSize]);
  return { columns };
};
export default useTableColumns;
