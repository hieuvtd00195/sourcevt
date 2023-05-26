import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import { useTranslation } from 'react-i18next';
import OrderTable from './components/Table';


const OderCOD = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('Báo cáo doanh thu theo cửa hàng')}>
      <PageBreadcrumbs
        title={t('Đơn hàng COD')}
        items={[
          { link: '/service', text: 'Dịch vụ' },
        ]}
      />
      <OrderTable />
    </PageWrapper>
  );
};

export default OderCOD;
