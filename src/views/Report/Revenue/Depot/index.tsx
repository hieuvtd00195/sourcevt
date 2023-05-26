import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';

const Depot = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Báo cáo doanh thu theo cửa hàng')}>
      <PageBreadcrumbs
        title={t('Theo cửa hàng')}
        items={[
          { link: '/report', text: 'Báo cáo' },
          { link: '/report/revenue', text: 'Doanh thu' },
        ]}
      />
      <Content />
    </PageWrapper>
  );
};

export default Depot;
