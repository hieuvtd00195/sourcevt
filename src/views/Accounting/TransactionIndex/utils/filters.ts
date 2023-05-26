import { SORT_DIRECTION } from 'constants/common';
import { ProTableSortingState } from 'components/ProTable/types';
import { useState } from 'react';
import { PaginationParams, PaginationParamsT } from 'types/common';
import { useSearchParams } from 'react-router-dom';

export interface FilterParams extends PaginationParamsT {
  storeIds: number[] | null;
  searchDateType: number | null;
  searchDateFrom: string | Date | null;
  searchDateTo: string | Date | null;
  //   documentTypes: number | null;
  documentCode: string | null;
  isDocument: boolean | null;
  accountingType: number | null;
  audienceType: number | null;
  audienceText: string | null;
  audiencePhone: string | null;
  audienceCode: string | null;
  documentDetailType: any[];
  note: string | null;
  accountCode: string | null;
  amount: string | number | null;
  creator: string | null;
  entryCode: string | null;
  entryType: number | null;
  ticketType: number | null;
  [key: string]: any;
}

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchUrl = searchParams.get('entryCode');

  const [filters, setFilters] = useState<FilterParams>({
    orderBy: '',
    orderDirection: '',
    pageIndex: 1,
    pageSize: 10,
    storeIds: null,
    entryCode: searchUrl ? searchUrl.toString() : null,
    entryType: null,
    ticketType: null,
    searchDateType: null,
    searchDateFrom: null,
    searchDateTo: null,
    audiencePhone: null,
    audienceCode: null,
    documentDetailType: [],
    // documentTypes: null,
    documentCode: null,
    isDocument: null,
    accountingType: null,
    audienceId: null,
    audienceType: null,
    audienceText: null,
    note: null,
    accountCode: null,
    amount: null,
    creator: null,
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
      storeIds: null,
      entryCode: null,
      entryType: null,
      ticketType: null,
      searchDateType: null,
      searchDateFrom: null,
      searchDateTo: null,
      audiencePhone: null,
      audienceCode: null,
      //   documentTypes: null,
      documentDetailType: [],
      documentCode: null,
      isDocument: null,
      accountingType: null,
      audienceType: null,
      audienceText: null,
      note: null,
      accountCode: null,
      amount: null,
      creator: null,
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
