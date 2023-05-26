import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useState } from 'react';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IImportExport } from './utils/types';

const DATA = [
  {
    id: 1,
    productCode: 'PHXSD',
    unit: 'VND',
    product: { code: '1234242', code2: 'GJDNRKD', name: 'IP15 Pro' },
    IMEI: '28236578864',
    thanhTien: 655456,
  },
  {
    id: 2,
    productCode: 'PHXSD',
    unit: 'VND',
    product: { code: '1234242', code2: 'GJDNRKD', name: 'IP15 Pro' },
    IMEI: '28236578864',
    thanhTien: 655456,
  },
  {
    id: 3,
    productCode: 'PHXSD',
    unit: 'VND',
    product: { code: '1234242', code2: 'GJDNRKD', name: 'IP15 Pro' },
    IMEI: '28236578864',
    thanhTien: 655456,
  },
];

const ImportBillTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IImportExport[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <ProTable<IImportExport>
      loading={loading}
      columns={columns}
      data={banners}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageNumber,
        total,
        pageSize: filters.pageSize,
        onPageChange,
        onPageSizeChange,
      }}
    />
  );
};

export default ImportBillTable;
