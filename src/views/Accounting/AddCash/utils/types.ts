export interface AddCash {
  transactionDate: Date | null;
  audienceType: number | null;
  cashAccount: number | null;
  ticketType: number | null;
  audienceId: string | null;
  reciprocalAccountCode: string | null;
  accountCode: string | null;
  amountCNY: number | string | null;
  amountVND: number | string | null;
  note: string;
}

export interface AccountingAccountType {
  code: string;
  id: string;
  name: string;
  phone: string | null;
  value: string;
}

export interface ResponseAccountingAccountType {
  [key: string]: any;
}
