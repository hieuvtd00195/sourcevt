import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
// import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Page from 'components/Page';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import EditHistory from './EditHistory';
import Info from './Info';
import ReturnBill from './ReturnBill';

interface Props {
  open: boolean;
  onClose: () => void;
  dataSelected: any;
}

const tabs = [
  {
    label: 'Thông tin',
    value: 'filter1',
    component: <Info />,
  },
  {
    label: 'Lịch sử sửa',
    value: 'filter2',
    component: <EditHistory />,
  },
  {
    label: 'Hóa đơn trả hàng',
    value: 'filter3',
    component: <ReturnBill />,
  },
];

const InfoDialog = (props: Props) => {
  // const { open, onClose } = props;
  // const { t } = useTranslation();

  const [value, setValue] = useState<string>('filter1');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };
  //   const [loading, setLoading] = useState<boolean>(false);
  // const theme = useTheme();

  return (
    <PageWrapper title={'Bán lẻ'}>
      <PageBreadcrumbs
        title={'Hóa đơn'}
        items={[
          { link: '/sales', text: 'Bán hàng' },
          { link: '/sales/retail', text: 'Bán lẻ' },
        ]}
      />
      <TabContext value={value}>
        {/* <Paper sx={{ display: 'grid', gridTemplateRows: 'auto auto 1fr' }}> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: 0,
            padding: 0,
            background: '#fff',
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
          <Box sx={{ margin: '2px' }}>
            <ProMenu
              position="left"
              items={[
                {
                  label: 'In phiếu',
                  value: 1,
                  actionType: 'print',
                },
                {
                  label: 'Xuất Excel',
                  value: 2,
                  actionType: 'excel',
                },
                {
                  label: 'Sửa phiếu',
                  value: 3,
                  actionType: 'edit',
                },
                {
                  label: 'In bảo hành',
                  value: 4,
                  actionType: 'print',
                },
                {
                  label: 'Đổi trả hàng',
                  value: 5,
                  actionType: 'back',
                },
                {
                  label: 'Hoạch toán lại kế toán',
                  value: 6,
                  actionType: 'load',
                },
                {
                  label: 'Xóa phiếu',
                  value: 7,
                  actionType: 'delete',
                },
              ]}
            >
              <ActionButton variant="contained">
                Thao tác
                <ExpandMoreIcon />
              </ActionButton>
            </ProMenu>
          </Box>
        </Box>
        <Divider />
        {tabs.map((tab, i) => (
          <TabPanel key={i} value={tab.value} sx={{ p: 0 }}>
            <Page title={tab.label}>{tab.component}</Page>
          </TabPanel>
        ))}
        {/* </Paper> */}
      </TabContext>
    </PageWrapper>
  );
};

export default InfoDialog;
