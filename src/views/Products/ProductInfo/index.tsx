import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ProMenu from 'components/ProMenu';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Basic from './Basic';
import Inventory from './Inventory';
import ImexProduct from './ImexProducts/ImexProductsTable';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

// Tab components
const tabs = [
  {
    label: 'Thông tin',
    value: 'basic',
    component: <Basic />,
  },
  {
    label: 'Tồn kho',
    value: 'inventory',
    component: <Inventory />,
  },
  {
    label: 'XNK',
    value: 'imex',
    component: <ImexProduct />,
  },
];

const ProductTab = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('basic');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };

  return (
    <PageWrapper title={t('Kính Lưng 14Pro Vàng (L)')}>
      <PageBreadcrumbs
        title={t('Kính Lưng 14Pro Vàng (L)')}
        items={[{ link: '/products', text: 'Sản phẩm' }]}
      />
      <TabContext value={value}>
        <Box sx={{ display: 'grid', gridTemplateRows: 'auto auto 1fr' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
            <Box
              sx={{
                minWidth: '150px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ProMenu
                items={[
                  {
                    label: 'In mã vạch sản phẩm',
                    value: 1,
                    actionType: 'print',
                  },
                  {
                    label: 'Sửa sản phẩm',
                    value: 2,
                    actionType: 'edit',
                  },
                  {
                    label: 'Sửa thông tin hiển thị trên website',
                    value: 3,
                    actionType: 'edit',
                  },
                  {
                    label: 'Chia thuộc tính',
                    value: 4,
                    actionType: 'tree',
                  },
                  {
                    label: 'Tính lại số tồn',
                    value: 5,
                    actionType: 'sync',
                  },
                  {
                    label: 'Tính lại giá vốn',
                    value: 6,
                    actionType: 'sync',
                  },
                  {
                    label: 'Tính lại số đang chuyển kho',
                    value: 7,
                    actionType: 'sync',
                  },
                  {
                    label: 'Tính lại số tạm giữ và đang chuyển',
                    value: 8,
                    actionType: 'sync',
                  },
                ]}
              >
                <Button startIcon={<ArrowOutwardIcon />}>Thao tác kho</Button>
              </ProMenu>
            </Box>
          </Box>
          <Divider />
          {tabs.map((tab, i) => (
            <TabPanel key={i} value={tab.value} sx={{ p: 0 }}>
              <Page title={tab.label}>{tab.component}</Page>
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </PageWrapper>
  );
};

export default ProductTab;
