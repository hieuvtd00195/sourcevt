import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button } from '@mui/material';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { SumaryCashStore } from './utils/type';

const DATA = [
  {
    id: 1,
    store: 'Linh kiện sài gòn',
    code: ['11111', '22222', '333333'],
    name: [
      'Tiền mặt 665 Lê Hồng Phong',
      '1012558168 VIETCOMBANK',
      'Quỹ Lê hồng phong',
    ],
    startBalance: [111111, 222222, 33333],
    totalCol: [111111, 222222, 33333],
    totalPay: [111111, 222222, 33333],
    lastBalance: [111111, 222222, 33333],
  },
  {
    id: 2,
    store: 'Linh kiện sài gòn',
    code: ['11111', '22222', '333333'],
    name: [
      'Tiền mặt 665 Lê Hồng Phong',
      '1012558168 VIETCOMBANK',
      'Quỹ Lê hồng phong',
    ],
    startBalance: [111111, 222222, 33333],
    totalCol: [111111, 222222, 33333],
    totalPay: [111111, 222222, 33333],
    lastBalance: [111111, 222222, 33333],
  },
  {
    id: 3,
    store: 'Linh kiện sài gòn',
    code: ['11111', '22222', '333333'],
    name: [
      'Tiền mặt 665 Lê Hồng Phong',
      '1012558168 VIETCOMBANK',
      'Quỹ Lê hồng phong',
    ],
    startBalance: [111111, 222222, 33333],
    totalCol: [111111, 222222, 33333],
    totalPay: [111111, 222222, 33333],
    lastBalance: [111111, 222222, 33333],
  },
  {
    id: 4,
    store: 'Linh kiện sài gòn',
    code: ['11111', '22222', '333333'],
    name: [
      'Tiền mặt 665 Lê Hồng Phong',
      '1012558168 VIETCOMBANK',
      'Quỹ Lê hồng phong',
    ],
    startBalance: [111111, 222222, 33333],
    totalCol: [111111, 222222, 33333],
    totalPay: [111111, 222222, 33333],
    lastBalance: [111111, 222222, 33333],
  },
  {
    id: 5,
    store: 'Linh kiện sài gòn',
    code: ['11111', '22222', '333333'],
    name: [
      'Tiền mặt 665 Lê Hồng Phong',
      '1012558168 VIETCOMBANK',
      'Quỹ Lê hồng phong',
    ],
    startBalance: [111111, 222222, 33333],
    totalCol: [111111, 222222, 33333],
    totalPay: [111111, 222222, 33333],
    lastBalance: [111111, 222222, 33333],
  },
];

const SumaryCashByStoreTable = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<SumaryCashStore[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <ProTable<SumaryCashStore>
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
      filter={
        <FiltersForm
          ref={filtersRef}
          onSearch={onSearch}
          onSubmit={handleSubmitFilters}
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <Fragment>
          <ProMenu
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'excel',
              },
              {
                label: 'In báo cáo',
                value: 2,
                onSelect: () => {
                  console.log('hihi');
                },
                actionType: 'print',
              },
            ]}
          >
            <Button startIcon={<KeyboardArrowDownIcon />}>Thao tác</Button>
          </ProMenu>
        </Fragment>
      }
    />
  );
};

export default SumaryCashByStoreTable;
