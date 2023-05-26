import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { SyntheticEvent, useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import BillTable from './Bill/BillTable';
import ImexProductsTable from './ImexProducts/ImexProductsTable';

const tabKeys = {
  filter: 'filter',
  filter1: 'filter1',
};
// Tab components
const tabs = [
  {
    label: 'Phiếu xuất nhập kho',
    value: 'filter',
    component: <BillTable />,
  },
  {
    label: 'Sản phẩm xuất nhập kho',
    value: 'filter1',
    component: <ImexProductsTable />,
  },
];

const InventoryTab = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const navigate = useNavigate();
  const iniValue = new URLSearchParams(search).get('value');
  const [value, setValue] = useState<string>(
    iniValue && iniValue in tabKeys ? iniValue : tabKeys.filter
  );

  const [searchParams] = useSearchParams();
  const valueQueryURL = searchParams.get('value') || '';
  const codeQueryURL = searchParams.get('code') || '';

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
    navigate(`/inventory?value=${tab}`);
  };
  useEffect(() => {
    if (codeQueryURL && valueQueryURL) {
      setValue(valueQueryURL);
      return;
    }
    navigate(`/inventory?value=${value}`);
  }, [codeQueryURL]);

  return (
    <PageWrapper title={t('Xuất nhập kho')}>
      <PageBreadcrumbs
        title={t('Xuất nhập kho')}
        items={[{ link: '/inventory/bill', text: 'Kho hàng' }]}
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

export default InventoryTab;
