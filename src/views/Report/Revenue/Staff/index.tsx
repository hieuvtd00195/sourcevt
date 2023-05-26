import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';

const Staff = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Báo cáo doanh thu theo nhân viên')}>
      <PageBreadcrumbs
        title={t('Theo nhân viên')}
        items={[
          { link: '/report', text: 'Báo cáo' },
          { link: '/report/revenue', text: 'Doanh thu' },
        ]}
      />
      <Content />
    </PageWrapper>
  );
};

export default Staff;
