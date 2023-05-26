import { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { PaginationParams } from 'types/common';
import { SearchDebtSupplierParams } from 'types/debtSupplier';

export interface FilterParams extends PaginationParams {
  searchDateFrom: string | null;
  searchDateTo: string | null;
  phoneNumber: string | null;
  supplierId: string | null;
  type: number | null;
  debtType: number | null;
  ndt: number | null;
}

const initialFilter: SearchDebtSupplierParams = {
  searchDateFrom: new Date(),
  searchDateTo: new Date(),
  phoneNumber: '',
  supplierId: null,
  type: null,
  debtType: null,
  ndt: null,
  supplierCode: '',

  orderBy: '',
  orderDirection: '',
  pageNumber: 1,
  pageIndex: 1,
  pageSize: 10,
};

const useFilters = () => {
  const [filters, setFilters] =
    useState<SearchDebtSupplierParams>(initialFilter);

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

  const onSearch = (params: Partial<SearchDebtSupplierParams>) => {
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
