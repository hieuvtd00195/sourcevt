import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box, Link, Stack, Typography } from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { BusinessResult } from './utils/type';

const DATA: BusinessResult[] = [
  {
    id: '1',
    target: 'Doanh thu bán hàng và cung cấp dịch vụ',
    value: { value: '2409916000', type: 'positive' },
    revenue: { value: '', type: 'positive' },
    description: '511',
  },
  {
    id: '2',
    target: 'Các khoản giảm trừ doanh thu	',
    value: { value: '122031000', type: 'negative' },
    revenue: { value: '', type: 'negative' },
    description: '521',
  },
  {
    id: '3',
    target: 'Doanh thu thuần vê bán hàng và cung cấp dịch vụ',
    value: { value: '2293647000', type: 'positive' },
    revenue: { value: '', type: 'positive' },
    description: 'A= 511 +521',
  },
  {
    id: '4',
    target: 'Giá vốn hàng bán',
    value: { value: '186528421', type: 'negative' },
    revenue: { value: '81.324', type: 'negative' },
    description: '632',
  },
  {
    id: '5',
    target: '	Lợi nhuận gộp về bán hàng và cung cấp dịch vụ',
    value: { value: '428362781', type: 'positive' },
    revenue: { value: '18.676', type: 'positive' },
    description: 'B= A +632',
  },
  {
    id: '6',
    target: 'Doanh thu hoạt động tài chính',
    value: { value: '', type: 'positive' },
    revenue: { value: '', type: 'positive' },
    description: '515',
  },
  {
    id: '7',
    target: 'Chi phí tài chính',
    value: { value: '33.000', type: 'negative' },
    revenue: { value: '0.001', type: 'negative' },
    description: '635',
  },
  {
    id: '8',
    target: 'Chi phí bán hàng',
    value: { value: '19881000', type: 'negative' },
    revenue: { value: '0.867', type: 'negative' },
    description: '641',
  },
  {
    id: '9',
    target: 'Chi phí quản lý doanh nghiệp',
    value: { value: '', type: 'negative' },
    revenue: { value: '', type: 'negative' },
    description: '642',
  },
  {
    id: '10',
    target: 'Lợi nhuận thuần từ hoạt động kinh doanh',
    value: { value: '408448781', type: 'negative' },
    revenue: { value: '17.808', type: 'negative' },
    description: 'C= B +515 +635 +641 +642',
  },
  {
    id: '11',
    target: 'Thu nhập khác',
    value: { value: '', type: 'negative' },
    revenue: { value: '', type: 'negative' },
    description: '711',
  },
  {
    id: '12',
    target: 'Chi phí khác',
    value: { value: '3401000', type: 'negative' },
    revenue: { value: '0.091', type: 'negative' },
    description: '811',
  },
  {
    id: '13',
    target: 'Lợi nhuận khác',
    value: { value: '3401000', type: 'negative' },
    revenue: { value: '0.091', type: 'negative' },
    description: 'D= 711 +811',
  },
  {
    id: '14',
    target: 'Tổng lợi nhuận kế toán trước thuế',
    value: { value: '643076546	', type: 'positive' },
    revenue: { value: '17.214', type: 'positive' },
    description: 'E= C +D',
  },
  {
    id: '15',
    target: 'Chi phí thuế Thu nhập doanh nghiệp',
    value: { value: '', type: 'positive' },
    revenue: { value: '', type: 'positive' },
    description: '821',
  },
  {
    id: '16',
    target: 'Lợi nhuận sau thuế thu nhập doanh nghiệp	',
    value: { value: '643076546	', type: 'positive' },
    revenue: { value: '17.214', type: 'positive' },
    description: 'F= E + 821',
  },
];

const InventoryTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<BusinessResult[]>(DATA);
  const [loading] = useState<boolean>(false);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onSearch } = useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <PageWrapper title="Báo cáo kết quả hoạt động kinh doanh của doanh nghiệp">
      <PageBreadcrumbs
        title="Báo cáo kết quả hoạt động kinh doanh của doanh nghiệp"
        items={[
          { text: 'Kế toán', link: '#' },
          { link: '/report/revenue/depot', text: 'Báo cáo' },
        ]}
      />
      <Fragment>
        <Box sx={{ height: '800px' }}>
          <ProTable<BusinessResult>
            title="Danh sách giao dịch"
            loading={loading}
            columns={columns}
            data={data}
            refetch={refetch}
            onSortingChange={onSortingChange}
            initialstate={{ hiddenColumns: [] }}
            filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
            toolBar={
              <Fragment>
                <ProMenu<number>
                  position="left"
                  items={[
                    {
                      label: 'Xuất Excel',
                      value: 1,
                      // onSelect: handleToggleExportInventory,
                      actionType: 'excel',
                    },
                    {
                      label: 'In Báo Cáo',
                      value: 2,
                      // onSelect: handleCloseChangeStore,
                      // disabled: rowIds.length === 0,
                      actionType: 'print',
                    },
                  ]}
                >
                  <ActionButton color="info">Thao tác</ActionButton>
                </ProMenu>
              </Fragment>
            }
          />
        </Box>
        <Stack sx={{ justifyContent: 'center', mt: 1 }} spacing={2}>
          <Box>
            <LightbulbIcon sx={{ fontSize: '40px' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1">Chú ý:</Typography>
            <Typography variant="subtitle1">
              - % / doanh thu = % / doanh thu thuần về bán hàng và cung cấp dịch
              vụ ( dòng 3)
            </Typography>
            <Typography variant="subtitle1">
              - Mặc định hệ thống sẽ tính hoạt động kinh doanh trong khoảng thời
              gian lọc
            </Typography>
            <Typography variant="subtitle1">
              - <span style={{ color: 'green' }}>Màu xanh</span> là số dương
              <span>, </span>
              <span style={{ color: 'red' }}>Màu đỏ</span> là số âm
            </Typography>
            <Typography variant="subtitle1">
              - Tham khảo thêm về cách hạch toán kết chuyển cuối kỳ{' '}
              <span>
                <Link href="#" color="red">
                  Tại đây
                </Link>
              </span>
            </Typography>
          </Box>
        </Stack>
      </Fragment>
    </PageWrapper>
  );
};

export default InventoryTable;
