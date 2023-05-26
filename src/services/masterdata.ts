import HttpClient from 'utils/HttpClient';

interface Data {
  [key: string]: any;
}
interface MasterData {
  [key: string]: any;
  data: Data[];
}

interface MasterDataParams {
  [key: string]: any;
}

export interface IUser {
  id: string;
  code: string | null;
  name: string | null;
  phone: string | null;
  value: string | null;
}

export interface ICustomer {
  id: string;
  name: string | null;
  phoneNumber: string | null;
  handlerEmployeeId: string | null;
  handlerEmployeeName: string | null;
  handlerStoreId: string | null;
  handlerStoreName: string | null;
  creatorId: string | null;
  createName: string | null;
  handlerStoreNames: string | null;
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

const MASTERDATA_SEARCH_API = '/api/app/master-data/SearchDocumentDetailType';
const MASTERDATA_AUDIENCE_SEARCH_API = '/api/app/master-data/SearchAudience';
const MASTERDATA_ACCOUNT_SEARCH_API = '/api/app/master-data/SearchAccount';
const MASTERDATA_PRODUCTS_SEARCH_API = '/api/app/master-data/SearchProduct';
const MASTERDATA_ACCOUNT_PAYMENT_SEARCH_API = '/api/app/account/Search';
const EXPORT_ACCOUNT_PAYMENT = '/api/app/account/Export';
const GET_PROVINCE = '/api/app/master-data/GetProvinces';
const SEARCH_USER = '/api/app/master-data/SearchUser';
const GET_LIST_CUSTOMER_API = '/api/app/customer/GetCustomers';

export const APISearcMasterData = async (params: MasterDataParams) => {
  return HttpClient.post<typeof params, MasterData[]>(
    MASTERDATA_SEARCH_API,
    params
  );
};

export const APISearcMasterAudience = async (params: MasterDataParams) => {
  return HttpClient.post<typeof params, MasterData[]>(
    MASTERDATA_AUDIENCE_SEARCH_API,
    params
  );
};

export const APISearchMasterAccount = async (params: MasterDataParams) => {
  return HttpClient.post<typeof params, MasterData[]>(
    MASTERDATA_ACCOUNT_SEARCH_API,
    params
  );
};

export const APISearcProductWithType = async (params: MasterDataParams) => {
  return HttpClient.post<typeof params, MasterData[]>(
    MASTERDATA_PRODUCTS_SEARCH_API,
    params
  );
};

export const APISearcPaymentAccount = async (params: MasterDataParams) => {
  return HttpClient.post<typeof params, MasterData>(
    MASTERDATA_ACCOUNT_PAYMENT_SEARCH_API,
    params
  );
};

// export const APIExportPaymentAccount = async (params: MasterDataParams) => {
//   return HttpClient.post<typeof params, CommonResponse<DownloadFile>>(
//     EXPORT_ACCOUNT_PAYMENT,
//     params
//   );
// };

export const APIExportPaymentAccount = async (params: any) => {
  return HttpClient.pull<typeof params, any>(EXPORT_ACCOUNT_PAYMENT, params, {
    responseType: 'blob',
  });
};

export const APIGetProvinceList = async () => {
  return HttpClient.get<MasterData>(`${GET_PROVINCE}`);
};

export const APIGetListUser = async (searchText?: string) => {
  return HttpClient.post<any, IUser[]>(SEARCH_USER, {
    searchText: searchText || '',
  });
};

export const APIGetListCustomer = async () => {
  return HttpClient.get<any>(GET_LIST_CUSTOMER_API);
};
