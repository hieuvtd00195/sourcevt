import { HttpResponse } from 'types/common';
import {
  IResGetWarehouseTransferMoving,
  ISearchWarehouseTransferMoving,
} from 'types/warehouseDelivering';
import HttpClient from 'utils/HttpClient';

const SEARCH_WAREHOUSE_TRANSFER_MOVING =
  '/api/app/WarehouseTransferBill/SearchWarehouseTransferMoving';
const EXPORT_WAREHOUSE_TRANSFER_MOVING =
  '/api/app/WarehouseTransferBill/ExportWarehouseTransferMoving';
const GET_WAREHOUSE_TRANSFER_MOVING = '/api/app/WarehouseTransferBill/GetById';
const DELETE_WAREHOUSE_TRANSFER_MOVING =
  '/api/app/WarehouseTransferBill/DeleteMoving';

export interface typeResponseStore {
  data: any[];
  total: number;
}

export const APISearchWarehouseTransferMoving = async (
  data: ISearchWarehouseTransferMoving
) => {
  return HttpClient.post<ISearchWarehouseTransferMoving, HttpResponse>(
    SEARCH_WAREHOUSE_TRANSFER_MOVING,
    data
  );
};

export const APIExportWarehouseTransferMoving = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_WAREHOUSE_TRANSFER_MOVING,
    params,
    {
      responseType: 'blob',
    }
  );
};

export const APIGetWarehouseTransferMoving = async (id: string) => {
  return HttpClient.get<IResGetWarehouseTransferMoving>(
    GET_WAREHOUSE_TRANSFER_MOVING,
    { params: { id } }
  );
};

export const APIDeleteWarehouseTransferMoving = async (id: string) => {
  return HttpClient.delete<null, HttpResponse>(
    DELETE_WAREHOUSE_TRANSFER_MOVING,
    { params: { id } }
  );
};
