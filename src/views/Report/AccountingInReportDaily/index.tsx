import { Paper } from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import SumaryCashByStoreTable from './SumaryCashByStoreTable';
const SumaryCashByStore = () => {
  return (
    <PageWrapper title={'Tổng hợp thu chi theo ngày'}>
      <PageBreadcrumbs
        title={'Tổng hợp thu chi theo ngày'}
        items={[
          { link: '/report', text: 'Báo cáo' },
          { link: '/accounting', text: 'Kế toán' },
        ]}
      />
      <Paper>
        <SumaryCashByStoreTable />
      </Paper>
    </PageWrapper>
  );
};

export default SumaryCashByStore;
