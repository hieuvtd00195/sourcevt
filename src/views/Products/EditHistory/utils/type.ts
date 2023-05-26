import { PaginationParams } from 'types/common';

export interface ISearchProductModificationHistory extends PaginationParams {
  startDate: Date | null;
  endDate: Date | null;
  productName: string | null;
  logType: number | null;
  logKind: number | null;
  parentChild: number | null;
  modifier: string | null;
}

export interface IProductModificationHistory {
  id: string;
  productCode: string | null;
  productName: string | null;
  logType: string | null;
  modifier: string | null;
  time: Date | null;
}

export interface IResAPIProductModificationHistory {
  data: IProductModificationHistory[];
  total: number;
}
