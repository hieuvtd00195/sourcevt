import { HttpResponse } from 'types/common';
import {
  ParamSearch,
  ParamSearchDebt,
  ParamsCreate,
  ResponseDebtType,
  ResponseTypeCreate,
  ResponseTypeSearch,
} from 'types/paymentReceipt';
import HttpClient from 'utils/HttpClient';
import { AddCash } from 'views/Accounting/AddCash/utils/types';

const PAYMENTRECIPT_CREATE_API = '/api/app/payment-receipt/Create';
const PAYMENTRECIPT_UPDATE_API = '/api/app/payment-receipt/Update';
const PAYMENTRECIPT_DELETE_API = '/api/app/payment-receipt/Delete';
const PAYMENTRECIPT_SEARCH_API = '/api/app/payment-receipt/Search';
const PAYMENTRECIPT_GET_API = '/api/app/payment-receipt/Get';
const DEBT_SEARCH_API = '/api/app/debt/Search';

export const APICreatePaymentReceipt = async (params: ParamsCreate) => {
  return HttpClient.post<ParamsCreate, ResponseTypeCreate>(
    PAYMENTRECIPT_CREATE_API,
    params
  );
};

export const APIDeletePaymentReceipt = async (id: string) => {
  return HttpClient.delete<null, HttpResponse>(PAYMENTRECIPT_DELETE_API, {
    params: { id },
  });
};

export const APIUpdatePaymentReceipt = async (params: ParamsCreate) => {
  return HttpClient.put<ParamsCreate, ResponseTypeCreate>(
    PAYMENTRECIPT_UPDATE_API,
    params
  );
};

export const APISearchPaymentReceipt = async (params: ParamSearch) => {
  return HttpClient.post<ParamSearch, ResponseTypeSearch>(
    PAYMENTRECIPT_SEARCH_API,
    params
  );
};

export const APISearchDebt = async (params: ParamSearchDebt) => {
  return HttpClient.post<ParamSearchDebt, ResponseDebtType>(
    DEBT_SEARCH_API,
    params
  );
};

export const APIPaymentreciptGet = async (id: string) => {
  return HttpClient.get<AddCash>(PAYMENTRECIPT_GET_API, {
    params: { id },
  });
};
