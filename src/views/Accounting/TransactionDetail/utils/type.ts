export interface Account {
  id: number;
  info: string;
}
export interface DebtAccount {
  code: string | null;
  amount: number | null;
}
export interface CreditAccount {
  code: string | null;
  amount: number | null;
}

export interface Entry {
  [key: string]: any
}
// export interface Entry {
//   id: string |number | null;
//   code: string | null;
//   entrySource: number | null;
//   entryType: number | null;
//   storeId: string | null;
//   sourceId: string | null;
//   sourceCode: string | null;
//   accountingType: number | null;

// //   documentTypes: number | null;
//   documentCode: string | null;
//   documentType: number | null;
//   ticketType: number | null;
//   audienceType: number | null;
//   audienceName: string | null;
//   audiencePhone: string | null;
//   audienceCode: string | null;
//   currency: number | null;
//   amount: number | null;
//   note: string | null;
//   transactionDate: string | null;
//   attachments: string | null;
//   creditAccount: CreditAccount;
//   debtAccount: DebtAccount;
//   creator: string | null;
//   creatorName: string | null;
//   creationTime: string | null;
//   lastModifierId: string | null;
//   lastModifierName: string | null;
//   lastModificationTime: string | null;
//   isActive: boolean;
// }


