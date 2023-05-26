import { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { PaginationParams } from 'types/common';

export interface FilterParams extends PaginationParams {
  startDate: string | null;
  endDate: string | null;
  id: string;
  store: string | number | null;
  oldCustomer: string | number | null;
  billsId: string;
  status: string | number | null;
  note: string;
  COD: string;
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: null,
    endDate: null,
    id: '',
    store: null,
    oldCustomer: null,
    billsId: '',
    status: null,
    note: '',
    COD: '',

    sortBy: '',
    sortDirection: '',
    pageNumber: 1,
    pageSize: 25,
  });

  const onSortingChange = (sorting?: ProTableSortingState) => {
    if (!sorting || !sorting.length) {
      setFilters((state) => ({
        ...state,
        sortBy: '',
        sortDirection: '',
      }));

      return;
    }

    const column = sorting[0];

    setFilters((state) => ({
      ...state,
      sortBy: column.id,
      sortDirection: column.desc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc,
    }));
  };

  const onPageChange = (pageNumber: number) => {
    setFilters((state) => ({
      ...state,
      pageNumber,
    }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilters((state) => ({
      ...state,
      pageSize,
    }));
  };

  const onSearch = (params: Partial<FilterParams>) => {
    setFilters((state) => ({
      ...state,
      ...params,
      pageNumber: 1,
    }));
  };

  const onChangeStatus = (status: number) => {
    setFilters((state) => ({
      ...state,
      pageNumber: 1,
      status,
    }));
  };

  return {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onChangeStatus,
  };
};

export default useFilters;
