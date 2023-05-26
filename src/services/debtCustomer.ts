import { DebtCustomerParams } from 'types/debtCustomer';
import { OrderTransport } from 'types/orderTransport';
import HttpClient from 'utils/HttpClient';

interface DebtCustomerResponse {
  data: OrderTransport[];
  total: number;
}

interface TotalDebtCustomerResponse {
  [key: string]: any;
}

const DEBT_CUSTOMER_SEARCH_API = '/api/app/DebtCustomer/Search';
const DEBT_CUSTOMER_TOTAL_API = '/api/app/DebtCustomer/TotalDebtCustomer';

export const APISearchDebtCustomer = async (params: DebtCustomerParams) => {
  return HttpClient.post<typeof params, DebtCustomerResponse>(
    DEBT_CUSTOMER_SEARCH_API,
    params
  );
};

export const APITotalDebtCustomer = async (params: DebtCustomerParams) => {
  return HttpClient.post<typeof params, TotalDebtCustomerResponse>(
    DEBT_CUSTOMER_TOTAL_API,
    params
  );
};
