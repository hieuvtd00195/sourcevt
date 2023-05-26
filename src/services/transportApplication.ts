import {
  ITransportByIdParams,
  IUpdateShipperTransport,
  IUpdateTransport,
} from 'types/transportApplication';
import HttpClient from 'utils/HttpClient';

const TRANSPORT_SEARCH_SHIPPER_API = '/api/app/transport/SearchShipper';
const TRANSPORT_UPDATE_SHIPPER_API = '/api/app/transport/UpdateShipper';
const TRANSPORT_UPDATE_STATUS_API = '/api/app/transport/UpdateStatus';
const TRANSPORT_BY_ID_API = '/api/app/transport/GetById';
const TRANSPORT_UPDATE_API =
  '/api/app/transport/UpdateTransportInformationInternal';

export const APISearchShipperTransport = async () => {
  return HttpClient.post<any>(TRANSPORT_SEARCH_SHIPPER_API);
};

export const APIUpdateShipperTransport = async (
  id: string,
  params: IUpdateShipperTransport
) => {
  return HttpClient.put<typeof params, any>(
    `${TRANSPORT_UPDATE_SHIPPER_API}?id=${id}`,
    params
  );
};

export const APIUpdateStatusTransport = async (id: string, status: number) => {
  return HttpClient.put<any, any>(
    `${TRANSPORT_UPDATE_STATUS_API}?id=${id}&input=${status}`
  );
};

export const APITransportById = async (params: ITransportByIdParams) => {
  return HttpClient.get<typeof params, any>(`${TRANSPORT_BY_ID_API}`, {
    params: params,
  });
};

export const APIUpdateTransport = async (
  id: string,
  params: IUpdateTransport
) => {
  return HttpClient.put<any, any>(`${TRANSPORT_UPDATE_API}?id=${id}`, params);
};
