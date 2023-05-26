import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import ProductTable from './ProductTable';

const OrderTransport = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Bán lẻ')}>
      <PageBreadcrumbs
        title={t('Đơn vận chuyển')}
        items={[{ link: '/sales', text: 'Bán hàng' }]}
      />
      <ProductTable />
    </PageWrapper>
  );
};

export default OrderTransport;
