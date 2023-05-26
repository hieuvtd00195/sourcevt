export interface TransactionHistory {
  id: string;
  code: string | null,
  transactionCode: string | null;
  transactionDate: Date | null;
  documentType: number;
  documentCode: string | null;
  ticketType: number;
  totalTransactionMoney: number;
  totalCnyTransaction: number;
  userAction: string | null;
  action: number;
  audienceCode: string | null;
  audienceName: string | null;
}

