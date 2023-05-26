import NewCustomerTable from './components/NewCustomerTable';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, useState } from 'react';
import PageWrapper from 'components/PageWrapper';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import { Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Page from 'components/Page';

// Tab components
const tabs = [
  {
    label: 'Khách hàng mới',
    value: 'filter',
    component: <NewCustomerTable />,
  },
  {
    label: 'Khách hàng - DVSP',
    value: 'filter1',
    component: <Box sx={{ p: 2.5 }}>Khách hàng - DVSP</Box>,
  },
];
const NewCustomer = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('filter');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };
  return (
    <PageWrapper title={t('Báo cáo')}>
      <PageBreadcrumbs
        title={t('Khách hàng mới')}
        items={[
          { link: '/report', text: 'Báo cáo' },
          { link: '/report/customer', text: 'Khách hàng' },
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

export default NewCustomer;
