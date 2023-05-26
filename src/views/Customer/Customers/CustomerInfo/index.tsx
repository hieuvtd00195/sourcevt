import { TabContext, TabPanel } from '@mui/lab';
import { Box, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PurchaseHistoryTable from './PurchaseHistory/Table';

const tabs = [
  {
    label: 'Lịch sử mua hàng',
    value: 'filter1',
    component: <PurchaseHistoryTable />,
  },
  {
    label: 'Lịch sử chăm sóc',
    value: 'filter2',
    component: <Box sx={{ p: 2.5 }}>Lịch sử chăm sóc</Box>,
  },
];

const CustomerInfo = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('filter1');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };
  return (
    <PageWrapper title={t('Khách hàng')}>
      <PageBreadcrumbs
        title={t('Thông tin khách hàng')}
        items={[{ link: '/customers', text: 'Khách hàng' }]}
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

export default CustomerInfo;
