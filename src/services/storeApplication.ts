import { HttpResponse } from 'types/shared';
import HttpClient from 'utils/HttpClient';

const STOREAPPLICATION_SEARCH_API = '/api/app/Store/GetIdName';

export interface dataSoreApplication {
  id: string;
  code: string | null;
  name: string | null;
}

export interface typeResponseStore {
  data: dataSoreApplication[];
  total: number;
}

export const APISearchStoreApplication = async () => {
  return HttpClient.get<HttpResponse<typeResponseStore>>(
    STOREAPPLICATION_SEARCH_API
  );
};

export const APIGetListStoreApplication = async () => {
  return HttpClient.get<dataSoreApplication[]>(STOREAPPLICATION_SEARCH_API);
};
