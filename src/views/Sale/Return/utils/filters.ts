import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import type { PaginationParams, PaginationParamsT } from 'types/common';
import { STATUS } from './constants';

export interface FilterParams extends PaginationParamsT {
  storeIds: string | null,
  billCode: string | null,
  productName: string | null,
  fromDate: Date | null,
  toDate: Date | null,
  customerName: string | null,
  employeeName: string | null,
  creatorName: string | null,
  billCustomerCode: string | null,
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    storeIds: null,
    billCode: null,
    productName: null,
    fromDate: null,
    toDate: null,
    customerName: null,
    employeeName: null,
    creatorName: null,
    billCustomerCode: null,

    orderBy: null,
    orderDirection: null,
    pageIndex: 1,
    pageSize: 25,
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
