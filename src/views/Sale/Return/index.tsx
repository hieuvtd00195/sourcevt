import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import ProductTable from './ProductTable';

const ProductTab = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Trả hàng')}>
      <PageBreadcrumbs
        title={t('Trả hàng')}
        items={[{ link: '/products', text: 'Bán hàng' }]}
      />
      <ProductTable />
    </PageWrapper>
  );
};

export default ProductTab;
