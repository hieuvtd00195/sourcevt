import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PaginationParamsT } from 'types/common';
import dayjs from 'dayjs';

export interface FilterParams extends PaginationParamsT {
  [key: string]: any;
}

const useFilters = () => {
  const dateFirst = new Date();
  dateFirst.setDate(1);
  const dateNow = new Date();

  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || '';
  const [filters, setFilters] = useState<FilterParams>({
    startDate: dayjs(dateFirst).format('YYYY-MM-DD'),
    endDate: dayjs(dateNow).format('YYYY-MM-DD'),
    orderBy: '',
    orderDirection: '',
    pageIndex: 1,
    pageSize: 25,
    billId: codeQueryURL ? codeQueryURL : '',
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

  const onPageChange = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
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
      pageIndex: 1,
    }));
  };

  const onChangeStatus = (status: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
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
