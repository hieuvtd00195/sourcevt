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
import BillLading from './../BillLading';
import OrderSlipProducts from './../OrderSlipProducts';
import Underselling from './../Underselling';
import OrderSlipTable from './OrderSlipTable';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const tabKeys = {
  filter: 'filter',
  filter1: 'filter1',
  filter2: 'filter2',
  filter3: 'filter3',
};
// Tab components
const tabs = [
  {
    label: 'Phiếu đặt hàng',
    value: 'filter',
    component: <OrderSlipTable />,
  },
  {
    label: 'Sản phẩm phiếu đặt hàng',
    value: 'filter1',
    component: <OrderSlipProducts />,
  },
  {
    label: 'Đơn vận chuyển TQ',
    value: 'filter2',
    component: <BillLading />,
  },
  {
    label: 'Hàng thiếu',
    value: 'filter3',
    component: <Underselling />,
  },
];

const OrderSlip = () => {
  // const { t } = useTranslation();
  // const [value, setValue] = useState<string>('filter');

  // const handleChange = (_event: SyntheticEvent, tab: string) => {
  //   setValue(tab);
  // };
  const { t } = useTranslation();
  const { search } = useLocation();
  const navigate = useNavigate();
  const iniValue = new URLSearchParams(search).get('value');
  const [value, setValue] = useState<string>(
    iniValue && iniValue in tabKeys ? iniValue : tabKeys.filter
  );
  const [titlePage, setTitlePage] = useState<string>('');

  const [searchParams] = useSearchParams();
  const valueQueryURL = searchParams.get('value') || null;
  const codeQueryURL = searchParams.get('code') || null;
  const invoiceNumberQueryURL = searchParams.get('invoiceNumber') || null;
  const supplierNameQueryURL = searchParams.get('supplierName') || null;

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
    navigate(`/inventory/order-slip?value=${tab}`);
  };

  useEffect(() => {
    if (codeQueryURL && valueQueryURL) {
      setValue(valueQueryURL);
    }
    if (invoiceNumberQueryURL && supplierNameQueryURL && valueQueryURL) {
      setValue(valueQueryURL);
    }
  }, [codeQueryURL, invoiceNumberQueryURL]);

  useEffect(() => {
    if (valueQueryURL) {
      setValue(valueQueryURL);
    }
  }, [valueQueryURL]);

  useEffect(() => {
    navigate(`/inventory/order-slip?value=${value}`);
  }, [value, navigate]);

  useEffect(() => {
    switch (value) {
      case 'filter':
        setTitlePage('Phiếu đặt hàng');
        break;
      case 'filter1':
        setTitlePage('Sản phẩm phiếu đặt hàng');
        break;
      case 'filter2':
        setTitlePage('Đơn vận chuyển TQ');
        break;
      case 'filter3':
        setTitlePage('Hàng thiếu');
        break;
      default:
        setTitlePage('Phiếu đặt hàng');
        break;
    }
  }, [value]);

  return (
    <PageWrapper title={t('Danh sách sản phẩm')}>
      <PageBreadcrumbs
        title={t(titlePage)}
        items={[{ link: '/inventory', text: 'Kho hàng' }]}
      />
      <TabContext value={value}>
        <Paper
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
            borderRadius: 0,
          }}
        >
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

export default OrderSlip;
