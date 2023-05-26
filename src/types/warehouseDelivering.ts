import { PaginationParams } from './common';

export interface ISearchWarehouseTransferMoving extends PaginationParams {
  toStoreIds: string[];
  fromStoreIds: string[];
  warehouseTransferCode: string | null;
  warehouseBillCode: string | null;
}

export interface WarehouseTransferMoving {
  id: string | null;
  code: string | null;
  createdTime: string | null;
  sourceStoreName: string | null;
  destinationStoreName: string | null;
  sp: number | null;
  quantity: number | null;
  totalMoney: number | null;
  transferBillType: null;
  creatorName: string | null;
  note: string | null;
  isDraftApproved: boolean | null;
  draftApprovedUserName: string | null;
  draftApprovedDate: Date | null;
  warehousingBillCode: string | null;
}

export interface IResSearchWarehouseTransferMoving {
  total: number;
  data: WarehouseTransferMoving[];
}

export interface IResGetWarehouseTransferMoving {
  [key: string]: any;
}
