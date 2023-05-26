import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import CustomerTable from './CustomerTable';

const Customer = () => {
  const { t } = useTranslation();
  return (
    <PageWrapper title={t('Khách hàng')}>
      <PageBreadcrumbs
        title={t('Danh sách khách hàng')}
        items={[{ link: '/customers', text: 'Khách hàng' }]}
      />
      <CustomerTable />
    </PageWrapper>
  );
};

export default Customer;
