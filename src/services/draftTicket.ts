import { HttpResponse } from 'types/common';
import {
  CreateDraftTicket,
  DraftTicket,
  IAPIApproveDraftTicket,
  IResGetDraftTicket,
  SearchDraftTicketParams,
} from 'types/draftTicket';
import HttpClient from 'utils/HttpClient';

const DRAFT_TICKET_SEARCH_API = '/api/app/WarehouseTransferBill/GetList';
const DRAFT_TICKET_CREATE_API = '/api/app/WarehouseTransferBill/Add';
const DRAFT_TICKET_DELETE_API = '/api/app/WarehouseTransferBill/Delete';
const DRAFT_TICKET_DELETE_RANGE_API =
  '/api/app/WarehouseTransferBill/DeleteRange';
const DRAFT_TICKET_SET_APPROVE_BY_ID_API =
  '/api/app/WarehouseTransferBill/SetApproveById';
const DRAFT_TICKET_APPROVE_API = '/api/app/WarehouseTransferBill/Approve';

export interface IResAPISearchDraftTicket {
  data: DraftTicket[];
  total: number;
}

export const APISearchDraftTicket = async (params: SearchDraftTicketParams) => {
  return HttpClient.post<SearchDraftTicketParams, IResAPISearchDraftTicket>(
    DRAFT_TICKET_SEARCH_API,
    params
  );
};

export const APICreateDraftTicket = async (data: CreateDraftTicket) => {
  return HttpClient.post<CreateDraftTicket, string>(
    DRAFT_TICKET_CREATE_API,
    data
  );
};

export const APIDeleteDraftTicket = async (id: string) => {
  return HttpClient.delete<null, HttpResponse>(DRAFT_TICKET_DELETE_API, {
    params: { id },
  });
};

export const APIDeleteDraftRangeTicket = async (ids: string[]) => {
  return HttpClient.delete<null, HttpResponse>(DRAFT_TICKET_DELETE_RANGE_API, {
    params: { ids },
  });
};

export const APIDraftTicketSetApproveById = async (id: string) => {
  return HttpClient.post<any, IResGetDraftTicket>(
    DRAFT_TICKET_SET_APPROVE_BY_ID_API,
    { id, productName: '' }
  );
};

export const APIApproveDraftTicket = async (body: IAPIApproveDraftTicket) => {
  return HttpClient.post<IAPIApproveDraftTicket, HttpResponse>(
    DRAFT_TICKET_APPROVE_API,
    body
  );
};
