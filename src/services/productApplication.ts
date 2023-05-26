import { HttpResponse } from 'types/shared';
import HttpClient from 'utils/HttpClient';

const PRODUCTAPPLICATION_CODE_NAME_API = '/api/app/Product/GetIdCodeName';

export interface dataProductApplication {
  id: string;
  code: string | null;
  name: string | null;
}

export const APICodeNameProductApplication = async () => {
  return HttpClient.get<dataProductApplication[]>(
    PRODUCTAPPLICATION_CODE_NAME_API
  );
};
