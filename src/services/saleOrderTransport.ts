import { ResponseStoreList } from 'types/saleOrderTransport';
import HttpClient from 'utils/HttpClient';

interface SearchParams {
  [key: string]: any;
}

const GET_LIST_STORE_API = '/api/app/Store/GetIdName';
const GET_LIST_ORDER_TRANSPORT_API = '/api/app/transport/Search';
const CREATE_ORDER_TRANSPORT_API = '/api/app/transport/Create';
const GET_LIST_CUSTOMER_TRANSPORT_API = '/api/app/transport/SearchCustomer';

export const APIgetStoreList = async () => {
  return HttpClient.get<ResponseStoreList>(GET_LIST_STORE_API);
};

export const APISearchOrderTransportList = async (
  params: SearchParams
) => {
  return HttpClient.post<typeof params, any>(
    GET_LIST_ORDER_TRANSPORT_API,
    params
  );
};

export const APIgetListCustomer = async (
  params: SearchParams
) => {
  return HttpClient.post<typeof params, any>(
    GET_LIST_CUSTOMER_TRANSPORT_API,
    params
  );
};


export const APICreateTransport = async (
  params: SearchParams
) => {
  return HttpClient.post<typeof params, any>(
    CREATE_ORDER_TRANSPORT_API,
    params
  );
};
