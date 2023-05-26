import { TabContext, TabPanel } from '@mui/lab';
import { Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from './Products/Table';
import SettingPriceTable from './SettingPriceList/SettingPriceTable';
import PriceTable from './PriceList/CRUD/PriceTable';

const tabs = [
  {
    label: 'Danh sách bảng giá',
    value: 'filter',
    component: <Table />,
  },
  {
    label: 'Thiết lập bảng giá',
    value: 'filter1',
    component: <SettingPriceTable />,
  },
  {
    label: 'Bảng giá',
    value: 'filter2',
    component: <PriceTable />,
  },
];

const SetPriceProduct = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('filter');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };

  return (
    <PageWrapper title={t('Sản phẩm')}>
      <PageBreadcrumbs
        title={t('Thiết lập bảng giá')}
        items={[{ link: '/products', text: 'Sản phẩm' }]}
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

export default SetPriceProduct;
