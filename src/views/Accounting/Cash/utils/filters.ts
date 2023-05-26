import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import type { PaginationParams } from 'types/common';

export interface FilterParams extends PaginationParams {
  store: number[];
  id: string;
  dayType: number;
  document: number;
  documentId: string;
  amount: string;
  billType: number;
  accountCode: string;
  objectType: number;
  note: string;
  planningType: number;
  type: number;
  object: string;
  creator: string;

  startDate: string | null;
  endDate: string | null;
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    store: [],
    id: '',
    dayType: 0,
    document: 0,
    documentId: '',
    amount: '',
    billType: 0,
    accountCode: '',
    objectType: 0,
    note: '',
    planningType: 0,
    type: 0,
    object: '',
    creator: '',
    startDate: null,
    endDate: null,

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
