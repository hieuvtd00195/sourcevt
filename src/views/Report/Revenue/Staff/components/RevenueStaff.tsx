import { Box } from '@mui/system';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFilters from 'views/Products/utils/filters';
import { IReportRevenueStaff } from '../utils/types';
import useTableColumns from './RevenueStaffColumns';

const DATA = [
  {
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
];

const RevenueStaff = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const [loading] = useState<boolean>(false);
  const [banners] = useState<IReportRevenueStaff[]>(DATA);
  const [total] = useState<number>(banners.length || 0);
  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <Box height="600px">
      <ProTable<IReportRevenueStaff>
        title="Danh sách"
        loading={loading}
        columns={columns}
        data={banners}
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

export default RevenueStaff;
