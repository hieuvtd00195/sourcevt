import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from './Table';

const ByProducts = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Xuất nhập tồn theo sản phẩm')}>
      <PageBreadcrumbs
        title={t('Xuất nhập tồn theo sản phẩm ')}
        items={[
          { link: '/report/revenue/index', text: 'Báo cáo' },
          { link: '/report/inventory/index', text: 'Tồn kho' },
        ]}
      />
      <Table />
    </PageWrapper>
  );
};

export default ByProducts;
