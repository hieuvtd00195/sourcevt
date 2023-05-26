export interface Account {
  id: number;
  info: string;
}

export interface Cash {
  id: number;
  transactionId: number;
  date: string;
  type: number;
  account: Account;
  contraAccount: Account;
  object: Account;
  document: number;
  receive: number;
  spend: number;
  creator: string;
  note: string;
  file: string;
}
