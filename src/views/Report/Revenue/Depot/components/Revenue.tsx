import { Box } from '@mui/system';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFilters from 'views/Products/utils/filters';
import { IReportRevenueDepot } from '../utils/types';
import useTableColumns from './RevenueColumns';

const DATA = [
  {
    time: '01/02',
    creator: 'Hòa SG 11:47 02/02',
    idBill: 123,
    store: 'Linh kiện sài gòn',
    customer: 'Táo Đen-Cmt8 (SG)',
    product: 'Vỏ 12PRM 5G trắng đẹp',
    price: 111,
    amount: 111,
    unit: 'Chiếc',
    vat: 111,
    discount: 11,
    totalPrice: 111,
    payment: 111,
    note: 'string;',
  },
  {
    time: '02/02',
    creator: 'Hòa SG 11:47 02/02',
    idBill: 1235,
    store: 'Linh kiện sài gòn',
    customer: 'Táo Đen-Cmt8 (SG)',
    product: 'Vỏ 12PRM 5G trắng đẹp',
    price: 111,
    amount: 111,
    unit: 'Chiếc',
    vat: 111,
    discount: 11,
    totalPrice: 111,
    payment: 111,
    note: 'string;',
  },
  {
    time: '03/02',
    creator: 'Hòa SG 11:47 02/02',
    idBill: 2123,
    store: 'Linh kiện sài gòn',
    customer: 'Táo Đen-Cmt8 (SG)',
    product: 'Vỏ 12PRM 5G trắng đẹp',
    price: 111,
    amount: 111,
    unit: 'Chiếc',
    vat: 111,
    discount: 11,
    totalPrice: 111,
    payment: 111,
    note: 'string;',
  },
];

const Revenue = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();
  const [loading] = useState<boolean>(false);
  const [banners] = useState<IReportRevenueDepot[]>(DATA);
  const [total] = useState<number>(banners.length || 0);

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const totalRow = [
    {
      time: 'Tổng',
      creator: 'Hòa SG 11:47 02/02',
      idBill: 2123,
      store: 'Linh kiện sài gòn',
      customer: 'Táo Đen-Cmt8 (SG)',
      product: 'Vỏ 12PRM 5G trắng đẹp',
      price: 111,
      amount: 111,
      unit: 'Chiếc',
      vat: 111,
      discount: 11,
      totalPrice: 111,
      payment: 111,
      note: 'string;',
    },
    {
      time: 'TB',
      creator: 'Hòa SG 11:47 02/02',
      idBill: 2123,
      store: 'Linh kiện sài gòn',
      customer: 'Táo Đen-Cmt8 (SG)',
      product: 'Vỏ 12PRM 5G trắng đẹp',
      price: 111,
      amount: 111,
      unit: 'Chiếc',
      vat: 111,
      discount: 11,
      totalPrice: 111,
      payment: 111,
      note: 'string;',
    },
  ];

  return (
    <Box height="600px">
      <ProTable<IReportRevenueDepot>
        title="Danh sách"
        loading={loading}
        columns={columns}
        data={[...totalRow, ...banners]}
        refetch={refetch}
        onSortingChange={onSortingChange}
        pagination={{
          page: filters.pageNumber,
          total,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        toolBar={
          <ProMenu
            position="right"
            items={[
              {
                label: 'Xuất excel',
                value: 2,
                actionType: 'excel',
              },
              {
                label: 'In báo cáo',
                value: 1,
                actionType: 'print',
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand">
              {t('Thao tác')}
            </ActionButton>
          </ProMenu>
        }
      />
    </Box>
  );
};

export default Revenue;
