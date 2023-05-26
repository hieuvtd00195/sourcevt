import type { ProTableSortingState } from 'components/ProTable/types';
import { SORT_DIRECTION } from 'constants/common';
import { useState } from 'react';
import type { PaginationParamsT } from 'types/common';
import { STATUS } from './constants';
import { useSearchParams } from 'react-router-dom';

export interface FilterParams extends PaginationParamsT {
  code: string | null;
  supplierId: string | null;
  storeId: string | null;
  status: string | null;
  fromDate: string | null;
  toDate: string | null;
  supplierName: string | null;
  invoiceNumber: string | null;
}

const useFilters = () => {
  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || null;
  const invoiceNumberQueryURL = searchParams.get('invoiceNumber') || null;
  const supplierNameQueryURL = searchParams.get('supplierName') || null;

  const [filters, setFilters] = useState<FilterParams>({
    code: codeQueryURL ? codeQueryURL : null,
    supplierId: null,
    storeId: null,
    status: null,
    fromDate: null,
    toDate: null,
    orderBy: null,
    orderDirection: null,
    supplierName: supplierNameQueryURL ? supplierNameQueryURL : null,
    invoiceNumber: invoiceNumberQueryURL ? invoiceNumberQueryURL : null,
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

  const onChangeStatus = (status: string) => {
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
