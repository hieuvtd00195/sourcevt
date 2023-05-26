import { Inventory, InventoryParams } from 'types/inventory';
import { SaleOrderReturn, SaleOrderReturnParams } from 'types/saleOrderReturn';

import HttpClient from 'utils/HttpClient';

const SALE_ORDER_RETURN_SEARCH_API = '/api/app/customer-return/GetList';
const CREATE_SALE_ORDER_RETURN_API = '/api/app/customer-return/Create';
const UPDATE_SALE_ORDER_RETURN_API = '/api/app/customer-return/Update';
const SALE_ORDER_RETURN_GETBYID_API = '/api/app/customer-return/Get'
export interface ResponseSaleOrderReturn {
  data: any;
  total: number;
}

export const APISearchSaleOrderReturn = async (params: SaleOrderReturnParams) => {
  return HttpClient.post<typeof params, ResponseSaleOrderReturn>(
    SALE_ORDER_RETURN_SEARCH_API,
    params
  );
};

export const APIAddSaleOrderReturn = async (params: SaleOrderReturnParams) => {
  return HttpClient.post<typeof params, []>(CREATE_SALE_ORDER_RETURN_API, params);
};


export const APIGetSaleOrderReturnById = async (id: string) => {
  return HttpClient.get<typeof id, any>(
    `${SALE_ORDER_RETURN_GETBYID_API}?id=${id}`
  );
};

export const APIUpdateSaleOrderReturn = async (params: SaleOrderReturnParams) => {
  return HttpClient.post<SaleOrderReturnParams, ResponseSaleOrderReturn>(
    UPDATE_SALE_ORDER_RETURN_API,
    params
  );
};