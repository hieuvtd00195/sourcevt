import {
  OrderTransport,
  OrderTransportDetail,
  OrderTransportParams,
  saleOrders,
} from 'types/orderTransport';
import { WarehousingBillLogs } from 'types/warehousingBillLogs';
import HttpClient from 'utils/HttpClient';

interface OrderTransportResponse {
  data: OrderTransport[];
  total: number;
}

interface OrderTransportDetailResponse {
  data: OrderTransportDetail;
  [key: string]: any;
}

interface SaleOrderByCodeResponse {
  data: saleOrders[];
}

interface DownloadFile {
  base64Data: string;
  fileName: string;
  fileType: string;
}

interface CommonResponse<D = any> {
  data: D | null;
  httpStatusCode: string;
  message: string;
  success: boolean;
  total: number;
}

const ORDER_TRANSPORT_SEARCH_API = '/api/app/order-transport/GetList';
const ORDER_TRANSPORT_CREATE_API = '/api/app/order-transport/Create';
const ORDER_TRANSPORT_DETAIL_API = '/api/app/order-transport/GetDetail';
const ORDER_TRANSPORT_UPDATE_API = '/api/app/order-transport/Update';
const ORDER_TRANSPORT_EXPORT_API = '/api/app/order-transport/Export';
const SALE_ORDER_BY_CODE_API = '/api/app/SaleOrder/SearchByCode';

export const APISearchOrderTransport = async (params: OrderTransportParams) => {
  return HttpClient.get<typeof params, OrderTransportResponse>(
    ORDER_TRANSPORT_SEARCH_API,
    {
      params: params,
    }
  );
};

export const APICreateOrderTransport = async (params: string[]) => {
  return HttpClient.post<typeof params>(ORDER_TRANSPORT_CREATE_API, params);
};

export const APIDetailOrderTransportById = async (id: string) => {
  return HttpClient.get<typeof id, OrderTransportDetailResponse>(
    `${ORDER_TRANSPORT_DETAIL_API}`,
    {
      params: { OrderTransportId: id },
    }
  );
};

export const APIExportOrderTransport = async (params: OrderTransportParams) => {
  return HttpClient.get<typeof params, Blob>(`${ORDER_TRANSPORT_EXPORT_API}`, {
    params: params,
    responseType: 'blob',
  }).then((res) => {
    const target = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = target;
    link.setAttribute('download', 'DanhSachDonVanChuyenTQ.xlsx');
    link.click();
    window.URL.revokeObjectURL(target);
  });
};

export const APISearchSaleOrderByCode = async (
  params: OrderTransportParams
) => {
  return HttpClient.get<typeof params, SaleOrderByCodeResponse>(
    SALE_ORDER_BY_CODE_API,
    {
      params: params,
    }
  );
};

export const APIUpdateOrderTransport = async (
  id: string,
  params: OrderTransportParams
) => {
  return HttpClient.put<typeof params, any>(
    `${ORDER_TRANSPORT_UPDATE_API}?OrderTransportId=${id}`,
    params
  );
};
