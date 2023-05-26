import { HttpResponse } from 'types/shared';
import HttpClient from 'utils/HttpClient';

interface WareHousingBill {
  [key: string]: any;
}
interface WareHousingBillResponse {
  data: WareHousingBill[];
  total: number;
}
interface WareHousingBillParams {
  [key: string]: any;
}

const WAREHOUSING_SEARCH_API = '/api/app/warehousing-bill/Search';
const WAREHOUSING_PRODUCT_SEARCH_API =
  '/api/app/warehousing-bill/SearchProductXnk';
const WAREHOUSING_CREATE_API = '/api/app/warehousing-bill/Create';
const WAREHOUSING_GETBYID_API = '/api/app/warehousing-bill/Get';
const WAREHOUSING_UPDATEBYID_API = '/api/app/warehousing-bill/Update';
const WAREHOUSING_DELETEBYID_API = '/api/app/warehousing-bill/Delete';
const WAREHOUSING_PRODUCT_DETAIL_API =
  '/api/app/warehousing-bill/GetUpdateProductInBillProduct';
const WAREHOUSING_PRODUCT_EDIT_API =
  '/api/app/warehousing-bill/UpdateProductInBillProduct';

const WAREHOUSING_PRODUCT_DELETE_API =
  '/api/app/warehousing-bill/DeleteProductInBillProduct';
const DELETE_LIST_PRODUCT_IN_BILL_PRODUCT_API =
  '/api/app/warehousing-bill/DeleteListProductInBillProduct';

export const APISearcWareHousingBill = async (
  params: WareHousingBillParams
) => {
  return HttpClient.post<typeof params, WareHousingBillResponse>(
    WAREHOUSING_SEARCH_API,
    params
  );
};

export const APICreateWareHousingBill = async (
  params: WareHousingBillParams
) => {
  return HttpClient.post<typeof params, WareHousingBillResponse>(
    WAREHOUSING_CREATE_API,
    params
  );
};

export const APISearchProductWareHousingBill = async (
  params: WareHousingBillParams
) => {
  return HttpClient.post<typeof params, WareHousingBillResponse>(
    WAREHOUSING_PRODUCT_SEARCH_API,
    params
  );
};

export const APIGetWareHousingBillById = async (id: string) => {
  return HttpClient.get<WareHousingBillResponse>(
    `${WAREHOUSING_GETBYID_API}?id=${id}`
  );
};

export const APIUpdateWareHousingBillById = async (
  params: WareHousingBillParams
) => {
  return HttpClient.put<typeof params, WareHousingBillResponse>(
    WAREHOUSING_UPDATEBYID_API,
    params
  );
};

export const APIDeleteWareHousingBillById = async (id: string) => {
  return HttpClient.delete<null, HttpResponse>(
    `${WAREHOUSING_DELETEBYID_API}?id=${id}`
  );
};

export const APIDeleteListProductInBillProduct = async (
  billProductIds: string[]
) => {
  return HttpClient.post<any, HttpResponse>(
    DELETE_LIST_PRODUCT_IN_BILL_PRODUCT_API,
    { billProductIds }
  );
};

export const APIDetailProductWareHousingBill = async (
  params: WareHousingBillParams
) => {
  return HttpClient.get<typeof params, WareHousingBillResponse>(
    WAREHOUSING_PRODUCT_DETAIL_API,
    {
      params: params,
    }
  );
};

export const APIEditProductWareHousingBill = async (
  params: WareHousingBillParams
) => {
  return HttpClient.post<typeof params, WareHousingBillResponse>(
    WAREHOUSING_PRODUCT_EDIT_API,
    params
  );
};

export const APIWarehousingProductDelete = async (id: string) => {
  return HttpClient.delete<null, HttpResponse>(WAREHOUSING_PRODUCT_DELETE_API, {
    params: { id },
  });
};
