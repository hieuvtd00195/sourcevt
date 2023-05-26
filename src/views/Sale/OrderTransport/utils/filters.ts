import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import type { PaginationParams, PaginationParamsT } from 'types/common';
import { STATUS } from './constants';

export interface FilterParams extends PaginationParamsT {
  searchDateFrom: string | null;
  searchDateTo: string | null;
  transportInformationCode: string | null;
  customerId: string | null;
  transportName: string | null;
  phoneNumber: string | null;
  shipperId: string | null;
  fromStoreId: string | null;
  status: number | null;
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    searchDateFrom: null,
    searchDateTo: null,
    transportInformationCode: null,
    customerId: null,
    transportName: null,
    phoneNumber: null,
    shipperId: null,
    fromStoreId: null,
    status: null,

    orderBy: '',
    orderDirection: '',
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
