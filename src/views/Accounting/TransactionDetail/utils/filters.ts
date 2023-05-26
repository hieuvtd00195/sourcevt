import { SORT_DIRECTION } from 'constants/common';
import { ProTableSortingState } from 'components/ProTable/types';
import { useState } from 'react';
import { PaginationParams, PaginationParamsT } from 'types/common';

export interface FilterParams extends PaginationParamsT {
  storeIds: number[] | null;
  ticketType: number | null;
  code: string | null;
  parentCode: string | null;
  documentCode: string | null;
  accountCode: string | null;
  start: string | null;
  end: string | null;
  audienceType: number | null;
  audience: string | null;
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    orderBy: '',
    orderDirection: '',
    pageIndex: 1,
    pageSize: 10,
    storeIds: [],
    ticketType: null,
    parentCode: '',
    code: '',
    documentCode: '',
    accountCode: '',
    start: null,
    end: null,
    audienceType: null,
    audience: '',
  });

  const onSortingChange = (sorting?: ProTableSortingState) => {
    if (!sorting || !sorting.length) {
      setFilters((state) => ({
        ...state,
        orderBy: '',
        orderDirection: '',
      }));
      return;
    }

    const column = sorting[0];

    setFilters((state) => ({
      ...state,
      orderBy: column.id,
      orderDirection: column.desc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc,
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
  const onClearFilter = () => {
    setFilters({
      orderBy: '',
      orderDirection: '',
      pageIndex: 1,
      pageSize: 10,
      storeIds: [],
      ticketType: null,
      parentCode: '',
      code: '',
      documentCode: '',
      accountCode: '',
      start: null,
      end: null,
      audienceType: null,
      audience: '',
    })
  }

  return {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onClearFilter
  };
};

export default useFilters;
