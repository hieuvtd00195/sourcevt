export interface IReportRevenueCustomer {
  id: string;
  customer: string;
  phoneNumber: string;
  order: number;
  bills: number;
  totalPurchase: number;
  returnInvoice: number;
  totalReturn: number;
  productsPurchased: number;
  productsReturned: number;
  accumulatedPoints: number;
  usedPoints: number;
  discount: number;
  revenue: number;
  price: number;
  profit: number;
}
