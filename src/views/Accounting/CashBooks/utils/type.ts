export interface Cash {
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
