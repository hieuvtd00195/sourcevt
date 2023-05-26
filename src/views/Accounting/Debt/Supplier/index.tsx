import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DebtSupplierTable from './DebtSupplierTable';

const tabs = [
  {
    label: 'Công nợ nhà cung cấp',
    value: 'filter',
    component: <DebtSupplierTable />,
  },
];

const DebtSupplier = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('filter');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };

  return (
    <PageWrapper title={t('Kế toán')}>
      <PageBreadcrumbs
        title={t('Nhà cung cấp')}
        items={[
          { link: '/accounting/transaction/cash', text: 'Kế toán' },
          { link: '/accounting/debt/customer', text: 'Công nợ' },
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

export default DebtSupplier;
