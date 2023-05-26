export interface Debt {
  [key: string]: any;
}

export interface PaymentTerm {
  createDate: string | null;
  creator: string;
  paymentTerm: string | null;
  customer: string;
  bill: number;
  money: number;
  discount: number;
  totalPaid: number;
  paid: number;
  stillOwed: number;
  store: string;
  phoneNumber: string;
  seller: string;
}
