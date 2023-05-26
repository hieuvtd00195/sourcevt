import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import Table from './Table';

const FormCare = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Khách hàng')}>
      <PageBreadcrumbs
        title={t('Hình thức chăm sóc')}
        items={[{ link: '/customers', text: 'Khách hàng' }]}
      />
      <Table />
    </PageWrapper>
  );
};

export default FormCare;
