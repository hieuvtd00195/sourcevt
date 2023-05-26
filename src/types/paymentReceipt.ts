export interface ParamsCreate {
  ticketType: number;
  audienceType: number;
  audienceId: string | null;
  accountCode: string;
  reciprocalAccountCode: string | null;
  amountVND: number | null;
  amountCNY: number | null;
  transactionDate: Date;
  note: string;
  id: string;
}

export interface ResponseTypeCreate {
  [key: string]: any;
}

export interface ParamSearch {
  storeIds: string[];
  ticketType: number[];
  accountCode: string | null;
  searchDateFrom: Date | null;
  searchDateTo: Date | null;
  isDocument: boolean | null;
  paymentReceiptCode: string | null;
  documentCode: string | null;
  audienceType: number | null;
  accountingType: number | null;
  documentDetailType: number | null;
  audienceName: string | null;
  note: string;
  creator: string | null;
}

export interface PaymentReceiptListType {
  attachFile?: string;
  id: string;
  code: string | null;
  reciprocalAccountCode: string | null;
  transactionDate: Date | null;
  accountCode: string | null;
  audienceTypeName: string | null;
  receive: number;
  spend: number;
  note: string;
  documentTypeName: string | null;
  documentCode: string | null;
  audienceCode: string | null;
  audienceName: string | null;
  audiencePhone: string | null;
  ticketTypeName: string | null;
  accountName: string | null;
  reciprocalAccountName: string | null;
  amountVND: number | null;
  amountCNY: number | null;
  accountingType: number;
}

export interface ResponseTypeSearch {
  data: PaymentReceiptListType[];
  total: number;
}

export interface ParamSearchDebt {
  orderBy: string | null;
  orderDirection: string | null;
  pageIndex: number | null;
  pageSize: number | null;
  supplierId: string | number | null;
  phoneNumber: string | null;
  debtType: number | null;
  searchDateFrom: Date | null;
  searchDateTo: Date | null;
  type: number | null;
  supplierCode: string | null;
  ndt: number | null;
}

export interface ResponseDebtType {
  [key: string]: any;
}
