import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import type { PaginationParams, PaginationParamsT } from 'types/common';

export interface FilterParams extends PaginationParamsT {
  storeIds: string[];
  ticketType: number[];
  accountCode: string | null;
  searchDateFrom: Date | null;
  searchDateTo: Date | null;
  isDocument: boolean | null;
  paymentReceiptCode: string | null;
  documentCode: string | null;
  audienceType: number | null;
  accountingType: number | null;
  documentDetailType: number | null;
  audienceName: string | null;
  note: string;
  creator: string | null;
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    paymentReceiptCode: null,
    storeIds: [],
    accountingType: null,
    documentCode: null,
    ticketType: [],
    isDocument: null,
    accountCode: null,
    audienceType: null,
    note: '',
    documentDetailType: null,
    audienceName: null,
    creator: null,
    searchDateFrom: null,
    searchDateTo: null,

    orderBy: null,
    orderDirection: null,
    pageIndex: 1,
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
