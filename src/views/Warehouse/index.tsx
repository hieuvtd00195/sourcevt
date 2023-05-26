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
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductTable from './ProductTable';
import DraftTicket from './DraftTicket/DraftTicket';
import Delivering from './Delivering/Delivering';
import Moving from './Moving/Moving';
import { useTypedSelector } from 'store';
import { useDispatch } from 'react-redux';
import { setTab } from 'slices/warehouseTransfer';

// Tab components
const tabs = [
  {
    label: 'Chuyển kho',
    value: '0',
    component: <ProductTable />,
  },
  {
    label: 'Phiếu nháp',
    value: '1',
    component: <DraftTicket />,
  },
  {
    label: 'Đang di chuyển',
    value: '2',
    component: <Delivering />,
  },
  {
    label: 'Sắp chuyển đến',
    value: '3',
    component: <Moving />,
  },
];

const ProductTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { tab } = useTypedSelector((state) => state.warehouseTransfer);

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    dispatch(setTab(tab));
  };

  return (
    <PageWrapper title={t('Chuyển kho')}>
      <PageBreadcrumbs
        title={t('Chuyển kho')}
        items={[{ link: '/warehouse', text: 'Kho hàng' }]}
      />
      <TabContext value={tab}>
        <Paper
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
            borderRadius: 0,
          }}
        >
          <Tabs
            value={tab}
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

export default ProductTab;
