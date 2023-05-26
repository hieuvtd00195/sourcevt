import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import type { PaginationParams, PaginationParamsT } from 'types/common';
import { STATUS } from './constants';
import { useSearchParams } from 'react-router-dom';

export interface FilterParams extends PaginationParamsT {
  [key: string]: any;
}

const useFilters = () => {
  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || '';
  const [filters, setFilters] = useState<FilterParams>({
    orderBy: '',
    orderDirection: '',
    pageIndex: 1,
    pageSize: 25,
    billCode: codeQueryURL ? codeQueryURL : '',
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
  const onClearFilter = (values: any) => {
    setFilters({
      ...values,
      orderBy: '',
      orderDirection: '',
      pageIndex: 1,
      pageSize: 25,
    });
  };
  return {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onChangeStatus,
    onClearFilter,
  };
};

export default useFilters;
