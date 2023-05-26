import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Page from 'components/Page';
import { SyntheticEvent, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './components/FiltersForm';
import Profit from './components/Profit';
import Revenue from './components/Revenue';
import Store from './components/Store';
import useFilters from './utils/filters';

const tabs = [
  {
    label: 'Cửa hàng',
    value: 'filter',
    component: <Store />,
  },
  {
    label: 'Doanh thu',
    value: 'filter1',
    component: <Revenue />,
  },
  {
    label: 'Lợi nhuận',
    value: 'filter2',
    component: <Profit />,
  },
];

const Content = () => {
  const { onSearch } = useFilters();
  const filtersRef = useRef<FiltersRef>(null);
  const [value, setValue] = useState<string>('filter');

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    setValue(tab);
  };

  return (
    <Paper>
      <FiltersForm ref={filtersRef} onSearch={onSearch} />
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
    </Paper>
  );
};

export default Content;
