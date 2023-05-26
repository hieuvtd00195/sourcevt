import HttpClient from 'utils/HttpClient';
import { HttpResponse } from 'types/common';

const GET_STORE_API = '/api/app/Store/GetIdName';
const GET_PRODUCT_WAREHOUSE_API = '/api/app/Product/MapStockQuantity';
const GET_SEARCH_WAREHOUSE_API =
  '/api/app/WarehouseTransferBill/SearchWarehouseTransfer';
const GET_SEARCH_MOVING_WAREHOUSE_API =
  '/api/app/WarehouseTransferBill/SearchWarehouseTransferComing';
const DELETE_MOVING_WAREHOUSE_API =
  '/api/app/WarehouseTransferBill/DeleteWarehouseTransferComing';
const POST_ADD_WAREHOUSE_API =
  '/api/app/WarehouseTransferBill/AddWarehouseTransferBill';
const DELETE_WAREHOUSE_API =
  '/api/app/WarehouseTransferBill/DeleteWarehouseTransferBill';
const ACCEPT_WAREHOUSE_API = '/api/app/WarehouseTransferBill/Confirm';
const GET_DETAIL_WAREHOUSE_BY_ID = '/api/app/WarehouseTransferBill/GetTranferBillById';
const EXPORT_WAREHOUSE_TRANSFER_COMING = '/api/app/WarehouseTransferBill/ExportWarehouseTransferComing';

export interface typeResponseStore {
  data: any[];
  total: number;
}

interface SearchParams {
  [key: string]: any;
}

interface IWarehouseTransferBillParams {
  [key: string]: any;
}

export const APIGetStore = async () => {
  return HttpClient.get<null, []>(GET_STORE_API);
};

export const APIGetProductWarehouse = async (storeId: string) => {
  return HttpClient.get<null, []>(GET_PRODUCT_WAREHOUSE_API, {
    params: { storeId },
  });
};

// export const APISearchWarehouseTransfer = async () => {
//   return HttpClient.get<HttpResponse<typeResponseStore>>(
//     GET_SEARCH_WAREHOUSE_API
//   );
// };

export const APIAddWarehouseTransferBill = async (
  params: IWarehouseTransferBillParams
) => {
  return HttpClient.post<typeof params, any>(POST_ADD_WAREHOUSE_API, params);
};

export const APISearchWarehouseTransfer = async (params: SearchParams) => {
  return HttpClient.post<typeof params, any>(GET_SEARCH_WAREHOUSE_API, params);
};

export const APISearchMovingWarehouseTransfer = async (
  params: SearchParams
) => {
  return HttpClient.post<typeof params, any>(
    GET_SEARCH_MOVING_WAREHOUSE_API,
    params
  );
};

export const APIDeleteMovingWarehouseTransfer = async (id: string) => {
  return HttpClient.delete<null, HttpResponse>(DELETE_MOVING_WAREHOUSE_API, {
    params: { id },
  });
};

export const APIDeleteWarehouse = async (storeId: string) => {
  return HttpClient.delete<null, any>(DELETE_WAREHOUSE_API, {
    params: { id: storeId },
  });
};

export const APIGetDetailWarehouseById = async (id: string) => {
  return HttpClient.get<IWarehouseTransferBillParams>(
    `${GET_DETAIL_WAREHOUSE_BY_ID}?id=${id}`
  );
};

export const APIAcceptWarehouse = async (params: SearchParams) => {
  return HttpClient.post<typeof params, any>(ACCEPT_WAREHOUSE_API, params);
};

export const APIExportWarehouseTransferComing = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_WAREHOUSE_TRANSFER_COMING,
    params,
    {
      responseType: 'blob',
    }
  );
};