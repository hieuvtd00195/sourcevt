import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { ISearchCustomer } from 'types/customer';

export const initFilter: ISearchCustomer = {
  sortBy: '',
  sortDirection: '',
  pageNumber: 1,
  pageSize: 10,
  pageIndex: 1,

  id: null,
  customerIds: [],
  customerType: null,
  supportEmployeeId: null,
  handlerEmployeeId: null,
  debtGroup: null,
  handlerStoreId: null,
  gender: null,
  provinceId: null,
  firstPurchaseDateFrom: null,
  firstPurchaseDateTo: null,
  lastPurchaseDateFrom: null,
  lastPurchaseDateTo: null,
  nonPurchaseDaysFrom: null,
  nonPurchaseDaysTo: null,
  purchaseCycleFrom: null,
  purchaseCycleTo: null,
};

const useFilters = () => {
  const [filters, setFilters] = useState<ISearchCustomer>(initFilter);

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

  const onSearch = (params: Partial<ISearchCustomer>) => {
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
