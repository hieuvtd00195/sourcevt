import {
  ICustomer,
  ICustomerByTypeResponse,
  ICustomerSelect,
  IResSearchCustomer,
  ISearchCustomer,
} from 'types/customer';
import HttpClient from 'utils/HttpClient';
import DateFns from 'utils/DateFns';

const CUSTOMER_CREATE_API = '/api/app/customer/Create';
const CUSTOMER_SEARCH_API = '/api/app/customer/Search';
const CUSTOMER_SEARCH_BY_NAME_OR_PHONE_API =
  '/api/app/customer/SearchByNameOrPhone';
const CUSTOMER_ALL_BY_CUSTOMER_TYPE_API =
  '/api/app/customer/GetAllCustomerByCustomerType';

export const APICreateCustomer = async (data: ICustomer) => {
  return HttpClient.post<any, string>(CUSTOMER_CREATE_API, data);
};

export const APISearchCustomer = async (filter: ISearchCustomer) => {
  return HttpClient.post<any, IResSearchCustomer>(CUSTOMER_SEARCH_API, {
    ...filter,
    firstPurchaseDateFrom: DateFns.Format(
      filter.firstPurchaseDateFrom,
      'yyyy-MM-dd'
    ),
    firstPurchaseDateTo: DateFns.Format(
      filter.firstPurchaseDateTo,
      'yyyy-MM-dd'
    ),
    lastPurchaseDateFrom: DateFns.Format(
      filter.lastPurchaseDateFrom,
      'yyyy-MM-dd'
    ),
    lastPurchaseDateTo: DateFns.Format(filter.lastPurchaseDateTo, 'yyyy-MM-dd'),
  });
};

export const APICustomerSearchByNameOrPhone = async (nameOrPhone: string) => {
  return HttpClient.get<ICustomerSelect[]>(
    CUSTOMER_SEARCH_BY_NAME_OR_PHONE_API,
    {
      params: { nameOrPhone },
    }
  );
};

export const APIAllCustomerByCustomerType = async (customerType: number) => {
  return HttpClient.get<typeof customerType, ICustomerByTypeResponse>(
    CUSTOMER_ALL_BY_CUSTOMER_TYPE_API,
    {
      params: { customerType },
    }
  );
};
