import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import CustomerTable from './components/CustomerTable';

const Customer = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Báo cáo doanh thu theo khách hàng')}>
      <PageBreadcrumbs
        title={t('Khách hàng')}
        items={[
          { link: '/report', text: 'Báo cáo' },
          { link: '/report/revenue', text: 'Doanh thu' },
        ]}
      />
      <CustomerTable />
    </PageWrapper>
  );
};

export default Customer;
