import { Product } from 'types/products';
import {
  IResponseSaleOrder,
  ISaleOrderParams,
  ResponseTypeSaleOrder,
  SaleOrder,
  IUpdateSaleOrder,
  ConfirmSaleOrderDetail,
} from 'types/saleorder';
import type { HttpResponse } from 'types/shared';
import HttpClient from 'utils/HttpClient';
const SALEORDER_SEARCH_API = '/api/app/SaleOrder/GetList';

interface SearchSaleOrderParams {
  orderBy: string | null;
  orderDirection: string | null;
  pageIndex: number;
  pageSize: number;
  code: string | null;
  supplierId: string | null;
  storeId: string | null;
  status: string | null;
  fromDate: string | null;
  toDate: string | null;
  supplierName: string | null;
}

interface ConfirmParams {
  [key: string]: any;
}

const SALE_ORDER_ADD_API = '/api/app/SaleOrder/Add';
const GET_PRODUCT_API = '/api/app/Product/GetIdCodeName';
const GET_SUPPLIER_API = '/api/app/Supplier/GetIdCodeName';
const GET_SUPPLIER_CHINA_API = '/api/app/Supplier/GetChineseSupplier';

const GET_STORE_API = '/api/app/Store/GetIdName';
const GET_DETAIL_BY_ID_SALEORDER = '/api/app/SaleOrder/GetById';
const PUT_SALE_ORDER_UPDATE_API = '/api/app/SaleOrder/Update';
const DELETE_SALE_ORDER_API = '/api/app/SaleOrder/Delete';
const GET_DETAIL_BY_ID_SALEORDERDETAIL = '/api/app/SaleOrder/GetDetailConfirmById';
const CONFIRM_SALEORDER_BY_ID = '/api/app/SaleOrder/Confirm';
const COMPLETE_SALEORDER_BY_ID = '/api/app/SaleOrder/Complete';
const EXPORT_SALE_ORDER = '/api/app/SaleOrder/Export'

interface SearchEntryParams {
  orderBy: string | null;
  orderDirection: string;
  pageIndex: number | null;
  pageSize: number | null;
  storeId: string | null;
  entryCode: string | null;
  entryType: number | null;
  searchDateType: number | null;
  searchDateFrom: string | null;
  searchDateTo: string | null;
  documentType: number | null;
  documentCode: string | null;
  accountingType: number | null;
  audienceType: number | null;
  audienceText: string | null;
  note: string | null;
  accountCode: string | null;
  amount: number | null;
  creatorId: string | null;
}

export const APIAddSaleOrder = async (params: ISaleOrderParams) => {
  return HttpClient.post<typeof params, []>(SALE_ORDER_ADD_API, params);
};

export const APIGetProduct = async () => {
  return HttpClient.get<null, []>(GET_PRODUCT_API);
};

export const APIGetSupplier = async () => {
  return HttpClient.get<null, []>(GET_SUPPLIER_API);
};

export const APIGetSupplierChina = async () => {
  return HttpClient.get<null, []>(GET_SUPPLIER_CHINA_API);
};

export const APIGetStore = async () => {
  return HttpClient.get<null, []>(GET_STORE_API);
};

export const APISearchSaleOrder = async (params: SearchSaleOrderParams) => {
  return HttpClient.post<typeof params, ResponseTypeSaleOrder>(
    SALEORDER_SEARCH_API,
    params
  );
};

export const APIGetDetailSaleOrderById = async (id: string) => {
  return HttpClient.get<IResponseSaleOrder>(
    `${GET_DETAIL_BY_ID_SALEORDER}?id=${id}`
  );
};

export const APIUpdateSaleOrder = async (params: IUpdateSaleOrder) => {
  return HttpClient.put<typeof params>(PUT_SALE_ORDER_UPDATE_API, params);
};

export const APIDeleteSaleOrder = async (id: string) => {
  return HttpClient.delete<null, any>(DELETE_SALE_ORDER_API, {
    params: { id: id },
  });
};

export const APIGetDetailSaleOrderConfirmById = async (id: string) => {
  return HttpClient.get<ConfirmSaleOrderDetail>(
    `${GET_DETAIL_BY_ID_SALEORDERDETAIL}?id=${id}`
  );
};

export const APIConfirmSaleOrder = async (params: ConfirmParams) => {
  return HttpClient.post<typeof params, ConfirmParams>(
    CONFIRM_SALEORDER_BY_ID,
    params
  );
};

export const APICompleteSaleOrderById = async (id: string) => {
  return HttpClient.get<IResponseSaleOrder>(
    `${COMPLETE_SALEORDER_BY_ID}?id=${id}`
  );
};

export const APIExportSaleOrder = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_SALE_ORDER,
    params,
    {
      responseType: 'blob',
    }

  );

}; 