import Paper from '@mui/material/Paper';
import { useRef } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './components/FiltersForm';
import Store from './components/RevenueStaff';
import useFilters from './utils/filters';

const Content = () => {
  const { onSearch } = useFilters();
  const filtersRef = useRef<FiltersRef>(null);

  return (
    <Paper>
      <FiltersForm ref={filtersRef} onSearch={onSearch} />
      <Paper sx={{ display: 'grid', gridTemplateRows: 'auto auto 1fr' }}>
        <Store />
      </Paper>
    </Paper>
  );
};

export default Content;
