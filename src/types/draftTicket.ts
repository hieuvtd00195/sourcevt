import { PaginationParams } from './common';

export interface DraftTicket {
  code: string | null;
  isFromDraft: boolean | null;
  sourceStoreId: string | null;
  sourceStoreName: string | null;
  destinationStoreId: string | null;
  destinationStoreName: string | null;
  totalProductCode: number | null;
  totalNumberProduct: number | null;
  note: string | null;
  transferStatus: number | null;
  draftApprovedUserId: string | null;
  draftApprovedName: string | null;
  draftApprovedDate: Date | null;
  deliveryConfirmedUserId: string | null;
  deliveryConfirmedName: string | null;
  deliveryConfirmedDate: Date | null;
  id: string;
  creatorId: string | null;
  creatorName: string | null;
  creationTime: string | null;
  lastModifierId: string | null;
  lastModifierName: string | null;
  lastModificationTime: Date | null;
  isActive: boolean | null;
  warehousingBillCode: string | null;
  warehousingBillId: string | null;
  billType: number | null;
  status: number | null;
  warehousingBillCodePNK: string | null;
  warehousingBillCodePXK: string | null;
}

export interface SearchDraftTicketParams extends PaginationParams {
  sourceStoreIds: string[] | null;
  destinationStoreIds: string[] | null;
  code: string | null;
  warehousingBillCode: string | null;
}

export interface IProductCreateDraftTicket {
  productId: string | null;
  quantity: number | null;
  note: string | null;
  code: string | null;
  barCode: string | null;
  name: string | null;
  stockQuantity: number | null;
  id: string;
  price: number | null;
  productName: string | null;
  requestQuantity: number | null;
  approveQuantity: number | null;
}

export interface CreateDraftTicket {
  sourceStoreId: string | null;
  destinationStoreId: string | null;
  note: string | null;
  productId: string[] | null;
  draftTicketProducts: IProductCreateDraftTicket[];
  form: IProductCreateDraftTicket[];
  quantityInput: number | null;
}

export interface IResGetDraftTicket {
  id: string;
  sourceStoreId: string;
  sourceStoreName: string;
  destinationStoreId: string;
  destinationStoreName: string;
  attachments: {
    id: string;
    name: string;
    url: string;
  }[];
  note: string;
  transferStatus: 0;
  draftTicketProducts: IProductCreateDraftTicket[];
}

export interface IAPIApproveDraftTicket {
  draftTicketProducts: { id: string; approveQuantity: number }[];
  note: string | null;
}
