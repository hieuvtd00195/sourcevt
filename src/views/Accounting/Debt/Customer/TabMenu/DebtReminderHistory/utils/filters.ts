import { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { IParamsGetListDebtReminderHistory } from 'types/debtReminderLog';

const useFilters = () => {
  const [filters, setFilters] = useState<IParamsGetListDebtReminderHistory>({
    sortBy: '',
    sortDirection: '',
    pageNumber: 1,
    pageIndex: 1,
    pageSize: 10,

    payDateFrom: null,
    payDateTo: null,
    code: null,
    customerId: null,
    creatorId: null,
    handlerEmployeeId: null,
    handlerStoreIds: [],
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

  const onSearch = (params: Partial<IParamsGetListDebtReminderHistory>) => {
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
