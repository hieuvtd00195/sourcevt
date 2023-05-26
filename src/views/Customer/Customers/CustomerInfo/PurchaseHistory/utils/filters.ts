import { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IParamsSearchPurchaseHistory } from 'types/purchaseHistory';

const useFilters = () => {
  const { id } = useParams();
  const [filters, setFilters] = useState<IParamsSearchPurchaseHistory>({
    customerId: id || null,
    from: null,
    to: null,
    billLogType: null,
    productName: null,

    sortBy: '',
    sortDirection: '',
    pageNumber: 1,
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

  const onSearch = (params: Partial<IParamsSearchPurchaseHistory>) => {
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
