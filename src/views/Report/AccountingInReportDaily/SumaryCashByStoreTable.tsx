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
    store: '09/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['3.404.276.030'],
  },
  {
    id: 2,
    store: '09/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['1.343.130.230'],
  },
  {
    id: 3,
    store: '08/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['775.488.000'],
  },
  {
    id: 4,
    store: '06/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['-40.916.000 '],
  },
  {
    id: 5,
    store: '06/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['1.038.730.800 '],
  },

  {
    id: 6,
    store: '07/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['1.924.724.000'],
  },
  {
    id: 7,
    store: '08/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['255.560.000'],
  },
  {
    id: 8,
    store: '02/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['69.473.000'],
  },
  {
    id: 9,
    store: '08/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['915.342.000'],
  },
  {
    id: 10,
    store: '09/02/2023',
    code: ['227.194.000'],
    name: ['99.473.000'],
    startBalance: ['127.721.000'],
    totalCol: ['977.118.800'],
    totalPay: ['708.273.000'],
    lastBalance: ['775.488.000'],
    total: ['3.915.342.000'],
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
