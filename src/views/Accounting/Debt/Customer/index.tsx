import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DebtTable from './TabMenu/DebtCustomer/DebtTable';
import PaymentTermTable from './TabMenu/PaymentTerm/PaymentTermTable';
import DebtReminderHistory from './TabMenu/DebtReminderHistory';

const tabs = [
  {
    label: 'Công nợ khách hàng',
    value: 'filter',
    component: <DebtTable />,
  },
  {
    label: 'Lịch sử nhắc nợ',
    value: 'filter1',
    component: <DebtReminderHistory />,
  },
  {
    label: 'Hạn thanh toán',
    value: 'filter2',
    component: <PaymentTermTable />,
  },
  {
    label: 'Quá hạn',
    value: 'filter3',
    component: <Box sx={{ p: 2.5 }}>Quá hạn</Box>,
  },
  {
    label: 'Hạn hôm nay',
    value: 'filter4',
    component: <Box sx={{ p: 2.5 }}>Hạn hôm nay</Box>,
  },
  {
    label: 'Hạn 7 ngày tới',
    value: 'filter5',
    component: <Box sx={{ p: 2.5 }}>Hạn 7 ngày tới</Box>,
  },
  {
    label: 'Hạn trên 7 ngày',
    value: 'filter6',
    component: <Box sx={{ p: 2.5 }}>Hạn trên 7 ngày</Box>,
  },
  {
    label: 'Báo cáo đã lưu',
    value: 'filter7',
    component: <Box sx={{ p: 2.5 }}>Báo cáo đã lưu</Box>,
  },
];

const DebtCustomer = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('filter');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };

  return (
    <PageWrapper title={t('Kế toán')}>
      <PageBreadcrumbs
        title={t('Công nợ khách hàng')}
        items={[
          { link: '/accounting/transaction/cash', text: 'Kế toán' },
          { link: '/debt/customer', text: 'Công nợ' },
        ]}
      />
      <TabContext value={value}>
        <Paper sx={{ display: 'grid', gridTemplateRows: 'auto auto 1fr' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                label={
                  <Typography
                    variant="subtitle2"
                    sx={{ textTransform: 'none' }}
                  >
                    {tab.label}
                  </Typography>
                }
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider />
          {tabs.map((tab, i) => (
            <TabPanel key={i} value={tab.value} sx={{ p: 0 }}>
              <Page title={tab.label}>{tab.component}</Page>
            </TabPanel>
          ))}
        </Paper>
      </TabContext>
    </PageWrapper>
  );
};

export default DebtCustomer;
