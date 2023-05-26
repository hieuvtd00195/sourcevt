export interface Dictionary<T = any> {
  [key: string]: T;
}

export type SortDirection = 'asc' | 'desc';

export type PickUnion<T> = { [K in keyof T]: Pick<T, K> }[keyof T];

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string | null;
  sortDirection?: string | null;
  orderBy?: string | null;
  orderDirection?: string | null;
  pageIndex?: number | null;
}

export interface PaginationParamsT {
  pageIndex: number;
  pageSize: number;
  sortBy?: string | null;
  sortDirection?: string | null;
  orderBy: string | null;
  orderDirection: string | null;

}

export interface HttpResponse<D = any> {
  data: D | null;
  errors: string[] | null;
  message: string | null;
  messageCode: string | null;
  total: number;
}
