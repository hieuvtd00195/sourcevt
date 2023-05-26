import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import { PaymentTerm } from '../../utils/type';
import useFilters from '../PaymentTerm/utils/filters';
import FiltersForm from './FilterForm';
import useTableColumns from './TableColumns';

const DATA = [
  {
    createDate: '22/12/2020',
    creator: 'Nguyễn Linh Đạt',
    paymentTerm: '23/12/2021',
    customer: 'Nguyễn Văn A',
    bill: 963021,
    money: 1000000,
    discount: 0,
    totalPaid: 1000000,
    paid: 0,
    stillOwed: 1000000,
    store: 'Linh kiện SG',
    phoneNumber: '0323698521',
    seller: '',
  },
];

const PaymentTermTable = () => {
  const { t } = useTranslation();

  const [, refetch] = useRefresh();
  const [banners] = useState<PaymentTerm[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  return (
    <ProTable<PaymentTerm>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={DATA}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageNumber,
        total,
        pageSize: filters.pageSize,
        onPageChange,
        onPageSizeChange,
      }}
      filter={
        <FiltersForm
          ref={filtersRef}
          onSearch={onSearch}
          onSubmit={handleSubmitFilters}
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <ActionButton iconPosition="end" actionType="upload" color="info">
          {t('Xuất Excel')}
        </ActionButton>
      }
    />
  );
};

export default PaymentTermTable;
