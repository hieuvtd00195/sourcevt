import type { IResponseTypeEntry, ResponseTypeEntry } from 'types/entry';
import HttpClient from 'utils/HttpClient';

const ENTRY_SEARCH_API = '/api/app/entry/Search';
const ENTRY_CREATE_API = '/api/app/entry/Create';
const ENTRY_GET_API = '/api/app/entry/GetById';
const ENTRY_UPDATE_API = '/api/app/entry/Update';
const ENTRY_GET_DETAIL_API = '/api/app/entry/EntryDetail';
const ENTRY_DELETE_API = '/api/app/entry/Delete';
const ENTRY_LOG_SEARCH_API = '/api/app/EntryLog/Search';
const DETAIL_ENTRY_LOG_API = '/api/app/EntryLog/DetailEntryLog';
const EXPORT_ENTRY_API = '/api/app/Entry/ExportEntry';

interface SearchEntryParams {
  [key: string]: any;
}
export interface AttachmentList {
  base64: any;
  fileName: string | null;
  contentType: string | null;
  extensions: string | null;
}
export interface CreateEntryParams {
  [key: string]: any;
  // transactionDate: Date | null;
  // ticketType: number | string | null;
  // documentCode: string | null;
  // audienceCode: string | null;
  // audienceType: number | null;
  // note: string | null;
  // entryAccounts: [];
  // attachments: AttachmentList[] | null;
}

interface SearchEntryDetailParams {
  storeIds: number[] | null;
  ticketType: number | null;
  code: string | null;
  parentCode: string | null;
  documentCode: string | null;
  accountCode: string | null;
  start: string | null;
  end: string | null;
  audienceType: number | null;
  audience: string | null;
}

interface IParams {
  [key: string]: any;
}


export const APISearchEntry = async (params: SearchEntryParams) => {
  return HttpClient.post<typeof params, ResponseTypeEntry>(
    ENTRY_SEARCH_API,
    params
  );
};

export const APISearchEntryLog = async (params: SearchEntryParams) => {
  return HttpClient.post<typeof params, ResponseTypeEntry>(
    ENTRY_LOG_SEARCH_API,
    params
  );
};

// export const APICreateEntry = async (params: FormData) => {
//   return HttpClient.post<FormData, ResponseTypeEntry>(
//     ENTRY_CREATE_API,
//     params,
//     { headers: { 'Content-Type': 'multipart/form-data' } }
//   );
// };

export const APICreateEntry = async (params: CreateEntryParams) => {
  return HttpClient.post<CreateEntryParams, ResponseTypeEntry>(
    ENTRY_CREATE_API,
    params
  );
};

export const APIUpdateEntry = async (params: CreateEntryParams) => {
  return HttpClient.post<CreateEntryParams, ResponseTypeEntry>(
    ENTRY_UPDATE_API,
    params
  );
};

export const APIGetByIdEntry = async (id: string) => {
  return HttpClient.get<IResponseTypeEntry>(ENTRY_GET_API, { params: { id } });
};

export const APIGetByIdEntryDetail = async (params: SearchEntryDetailParams) => {
  return HttpClient.post<typeof params, ResponseTypeEntry>(
    ENTRY_GET_DETAIL_API,
    params
  );
};
export const APIDeleteEntry = async (id: any) => {
  return HttpClient.delete<any>(ENTRY_DELETE_API, { params: { id } });
};

export const APIGetDetailEntryLog = async (params: SearchEntryParams) => {
  return HttpClient.get<typeof params, any>(DETAIL_ENTRY_LOG_API, {
    params: { entryLogId: params }
  });
};

export const APIExportEntry = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_ENTRY_API,
    params,
    {
      responseType: 'blob',
    }
  );
};
