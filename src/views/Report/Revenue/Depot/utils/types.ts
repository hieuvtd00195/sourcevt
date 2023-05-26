export interface IReportRevenueDepot {
  creator: string;
  idBill: number;
  store: string;
  customer: string;
  product: string;
  price: number;
  amount: number;
  unit: string;
  vat: number;
  discount: number;
  totalPrice: number;
  payment: number;
  note: string;
  [key: string]: any;
}
