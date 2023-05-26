import { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { PaginationParamsT } from 'types/common';

export interface FilterParams extends PaginationParamsT {
  code: string | null;
  startCreated: string | null;
  endCreated: string | null;
  startTransaction: string | null;
  endTransaction: string | null;
  action: number | null;
  documentDetailType: number | null;
  documentCode: string | null;
  documentType: number | null;
  audienceType: number | null;
  audience: string | null;
  userAction: string | null;
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    code: null,
    startCreated: null,
    endCreated: null,
    startTransaction: null,
    endTransaction: null,
    action: null,
    documentDetailType: null,
    documentCode: null,
    documentType: null,
    audienceType: null,
    audience: null,
    userAction: null,
    orderBy: '',
    orderDirection: '',
    sortBy: '',
    sortDirection: '',
    pageIndex: 1,
    pageSize: 10,
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

  const onClearFilter = () => {
    setFilters({
      code: null,
      startCreated: null,
      endCreated: null,
      startTransaction: null,
      endTransaction: null,
      action: null,
      documentDetailType: null,
      documentCode: null,
      documentType: null,
      audienceType: null,
      audience: null,
      userAction: null,
      orderBy: '',
      orderDirection: '',
      sortBy: '',
      sortDirection: '',
      pageIndex: 1,
      pageSize: 10,
    })
  }

  return { filters, onClearFilter, onSortingChange, onPageChange, onPageSizeChange, onSearch };
};

export default useFilters;
