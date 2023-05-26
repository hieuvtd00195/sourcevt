import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import ProductPortfolioTable from './ProductPortfolio/ProductPortfolioTable';

const CategoryTab = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Danh mục')}>
      <PageBreadcrumbs
        title={t('Danh mục')}
        items={[{ link: '/products', text: 'Sản phẩm' }]}
      />
      <ProductPortfolioTable />
    </PageWrapper>
  );
};

export default CategoryTab;
