import { DebtSupplier, SearchDebtSupplierParams } from 'types/debtSupplier';
import HttpClient from 'utils/HttpClient';

const DEBT_SUPPLIER_SEARCH_API = '/api/app/debt/Search';
const EXPORT_DEBT_SUPPLIER_API = '/api/app/debt/ExportDebt';
const EXPORT_DEBT_SUPPLIER_DETAIL_API = '/api/app/debt/ExportDebtDetail';
const DEBT_GET_DETAIL_API = '/api/app/debt/GetDebtDetail';
const GET_LIST_SUPPLIERS_SEARCH_API = '/api/app/debt/GetListSuppliers';

interface SearchDebtSupplierDetailParams {
  parentId: string | null;
  parentCode: string | null;
  documentCode: string | null;
  ticketType: number | null;
  start: Date | null;
  end: Date | null;
  note: string | null;
}
export interface IResAPISearchDebtSupplier {
  data: DebtSupplier[];
  total: number;
  type: 1 | 2 | 3 | null;
}

export const APISearchDebtSupplier = async (
  params: SearchDebtSupplierParams
) => {
  return HttpClient.post<SearchDebtSupplierParams, IResAPISearchDebtSupplier>(
    DEBT_SUPPLIER_SEARCH_API,
    params
  );
};

export const APIGetListSuppliersSearchApi = async (type: number | null) => {
  return HttpClient.post<null>(GET_LIST_SUPPLIERS_SEARCH_API, null, {
    params: { type },
  });
};

export const APIGetByIdDebtSupplierDetail = async (params: SearchDebtSupplierDetailParams) => {
  return HttpClient.post<typeof params, IResAPISearchDebtSupplier>(
    DEBT_GET_DETAIL_API,
    params
  );
};


export const ExportDebtSupplierAPI = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_DEBT_SUPPLIER_API,
    params,
    {
      responseType: 'blob',
    }
  );
};

export const ExportDebtSupplierDetailAPI = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_DEBT_SUPPLIER_DETAIL_API,
    params,
    {
      responseType: 'blob',
    }
  );
};