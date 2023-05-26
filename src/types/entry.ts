export interface DebtAccount {
  code: string | null;
  amount: number | null;
}
export interface CreditAccount {
  code: string | null;
  amount: number | null;
}
export interface Entry {
  id: string | string;
  code: string | null;
  entrySource: number | null;
  entryType: number | null;
  storeId: string | null;
  sourceId: string | null;
  sourceCode: string | null;
  accountingType: number | null;
  //   documentTypes: number | null;
  documentCode: string | null;
  documentType: number | null;
  ticketType: number | null;
  audienceType: number | null;
  audienceName: string | null;
  audiencePhone: string | null;
  audienceCode: string | null;
  currency: number | null;
  amount: number | null;
  note: string | null;
  transactionDate: string | null;
  attachments: string | null;
  creditAccount: CreditAccount;
  debtAccount: DebtAccount;
  creator: string | null;
  creatorName: string | null;
  creationTime: string | null;
  lastModifierId: string | null;
  lastModifierName: string | null;
  lastModificationTime: string | null;
  isActive: boolean;
}

export interface IEntry {
  id: string | number | string;
  audienceId: string | null;
  code: string | null;
  entrySource: number | null;
  entryType: number | null;
  storeId: string | null;
  sourceId: string | null;
  sourceCode: string | null;
  accountingType: number | null;
  //   documentTypes: number | null;
  documentCode: string | null;
  documentReferenceType: number | null;
  ticketType: number | null;
  audienceType: number | null;
  audienceName: string | null;
  audienceCode: string | null;
  currency: number | null;
  amount: number | null;
  note: string | null;
  transactionDate: Date | null;
  attachments: IAttachments | null;
  creditAccount: string | null;
  debtAccount: DebtAccount;
  creator: string | null;
  creatorName: string | null;
  creationTime: string | null;
  lastModifierId: string | null;
  lastModifierName: string | null;
  lastModificationTime: string | null;
  isActive: boolean;
}

export interface IAttachments {
  key: string | null;
  files: {
    name: string | null;
    url: string | null;
  }[];
}

export interface ResponseTypeEntry {
  total: number;
  data: Entry[];
}

export interface IEntryAccount {
  entryId: string;
  creditAccountCode: string | null;
  debtAccountCode: string | null;
  amountVnd: number | null;
  amountCny: null | null;
  documentType: number | string | null;
  documentCode: string | null;
  note: string | null;
  id: string | null;
  creatorId: string | null;
  creatorName: string | null;
  creationTime: Date | null;
  lastModifierId: string | null;
  lastModifierName: string | null;
  lastModificationTime: Date | null;
  isActive: boolean | null;
}

export interface IResponseTypeEntry {
  entry: IEntry;
  entryAccount: IEntryAccount[];
}
