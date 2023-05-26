import { Box } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useRef, useState } from 'react';
import { FiltersRef } from 'types/refs';
import FilterForm from './FilterForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filter';
import { IFormCareType } from './utils/type';

const DATA = [
  {
    id: 5451,
    formality: 'Tặng tiền tích lũy',
    creator: 'Luân',
    name: 'Tặng tiền tích lũy',
    createTime: null,
  },
  {
    id: 5452,
    formality: 'Gửi email',
    creator: 'Luân',
    name: 'Kỷ luật',
    createTime: null,
  },
  {
    id: 5453,
    formality: 'Trừ điểm',
    creator: 'Luân',
    name: 'Khen thưởng',
    createTime: null,
  },
];

const Table = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<IFormCareType[]>(DATA);
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
    <ProTable<IFormCareType>
      title="Lý do chăm sóc"
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
        <FilterForm
          ref={filtersRef}
          onSearch={onSearch}
          onSubmit={handleSubmitFilters}
          onClear={handleResetFilters}
        />
      }
      toolBar={
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <ActionButton
            variant="contained"
            color="primary"
            actionType="add"
            // onClick={handleSubmitFilters}
          >
            Thêm mới
          </ActionButton>
        </Box>
      }
    />
  );
};

export default Table;
