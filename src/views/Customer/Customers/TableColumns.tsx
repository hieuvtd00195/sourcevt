import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ICustomer } from 'types/customer';
import DateTime from 'utils/DateTime';

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const columnHelper = getColumnHelper<ICustomer>();

interface Props {
  pageNumber: number;
  pageSize: number;
}

const HEAD_CELLS: HeadCell<ICustomer> = {
  id: 'ID',
  index: '',
  customer: 'Khách hàng',
  address: 'Địa chỉ',
  store: 'CHPT',
  typeCustomer: 'Loại',
  phoneNumber: 'Điện thoại',
  email: 'Email',
  birthDay: 'Ngày sinh',
  level: 'Cấp độ',
  group: 'Nhóm',
  totalMoney: 'Tổng tiền',
  point: 'Điểm',
  numberPurchase: 'Lần mua',
  daysPurchase: 'Số ngày mua',
  amount: 'SL',
  lastDatePurchase: 'Ngày mua gần nhất',
  buyingCycle: 'Chu kỳ mua',
  daysNotPurchase: 'Số ngày chưa mua',
  note: 'Ghi chú',
  actions: 'Hành động',
};

const useTableColumns = (props: Props) => {
  const columns: ProColumn<ICustomer> = useMemo(() => {
    return [
      Selection<ICustomer>(),
      columnHelper.accessor('code', {
        id: 'id',
        size: 55,
        header: () => HEAD_CELLS.id,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 200,
        header: () => HEAD_CELLS.customer,
        cell: (context) => {
          const { id } = context.row.original;

          return (
            <StyledLink to={`/customers/customer-info/${id}`}>
              <Typography variant="subtitle2">{context.getValue()}</Typography>
            </StyledLink>
          );
        },
        meta: {
          title: HEAD_CELLS.customer,
        },
      }),
      columnHelper.accessor('address', {
        id: 'address',
        size: 150,
        header: () => HEAD_CELLS.address,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.address,
        },
      }),
      columnHelper.accessor('handlerStoreName', {
        id: 'handlerStoreName',
        size: 150,
        header: () => HEAD_CELLS.store,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.store,
        },
      }),
      columnHelper.accessor('customerTypeName', {
        id: 'customerTypeName',
        size: 150,
        header: () => HEAD_CELLS.typeCustomer,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000913' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.typeCustomer,
        },
      }),
      columnHelper.accessor('phoneNumber', {
        id: 'phoneNumber',
        size: 150,
        header: () => HEAD_CELLS.phoneNumber,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.phoneNumber,
        },
      }),

      columnHelper.accessor('dateOfBirth', {
        id: 'dateOfBirth',
        size: 100,
        header: () => HEAD_CELLS.birthDay,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {DateTime.Format(context.getValue(), 'DD/MM/YYYY')}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.birthDay,
        },
      }),
      columnHelper.accessor('totalPurchaseAmount', {
        id: 'totalPurchaseAmount',
        size: 150,
        header: () => HEAD_CELLS.totalMoney,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#038151' }}>
            {context.getValue()?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalMoney,
        },
      }),

      columnHelper.accessor('numberOfPurchaseTime', {
        id: 'numberOfPurchaseTime',
        size: 100,
        header: () => HEAD_CELLS.numberPurchase,
        cell: (context) => {
          const { id } = context.row.original;

          return (
            <StyledLink to={`/customers/customer-info/${id}`}>
              <Typography variant="subtitle2">{context.getValue()}</Typography>
            </StyledLink>
          );
        },
        meta: {
          title: HEAD_CELLS.numberPurchase,
        },
      }),

      columnHelper.accessor('purchaseQuantity', {
        id: 'purchaseQuantity',
        size: 85,
        header: () => HEAD_CELLS.amount,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.amount,
        },
      }),
      columnHelper.accessor('lastPurchaseDate', {
        id: 'lastPurchaseDate',
        size: 65,
        header: () => HEAD_CELLS.lastDatePurchase,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {DateTime.Format(context.getValue(), 'DD/MM/YYYY')}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.lastDatePurchase,
        },
      }),
      columnHelper.accessor('purchaseCycle', {
        id: 'purchaseCycle',
        size: 150,
        header: () => HEAD_CELLS.buyingCycle,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.buyingCycle,
        },
      }),
      columnHelper.accessor('nonPurchaseDays', {
        id: 'nonPurchaseDays',
        size: 65,
        header: () => HEAD_CELLS.daysNotPurchase,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#000000' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.daysNotPurchase,
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
                  label: 'Sửa khách hàng',
                  value: 2,
                  actionType: 'edit',
                },
                {
                  label: 'Xóa khách hàng',
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
        },
      },
    ];
  }, []);
  return { columns };
};

export default useTableColumns;
